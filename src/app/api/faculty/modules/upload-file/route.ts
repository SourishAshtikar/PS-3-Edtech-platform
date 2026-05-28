import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const subtopicId = formData.get("subtopicId") as string;
    const resourceType = formData.get("resourceType") as string; // notes, quizFile, mindMap, flashCards, reference, other

    if (!file || !subtopicId || !resourceType) {
      return NextResponse.json({ error: "File, subtopicId, and resourceType are required" }, { status: 400 });
    }

    // 1. Get the subtopic, module, and subject names for folder creation
    const subtopic = await prisma.subtopic.findUnique({
      where: { id: subtopicId },
      include: {
        module: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!subtopic) {
      return NextResponse.json({ error: "Subtopic not found" }, { status: 404 });
    }

    // 2. Get Google Account tokens
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: "google",
      },
    });

    if (!account || !account.access_token) {
      return NextResponse.json({ error: "Google Drive not connected or tokens missing" }, { status: 403 });
    }

    // 3. Initialize Google Drive client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Helper function to find or create a folder
    async function getOrCreateFolder(folderName: string, parentId?: string): Promise<string> {
      let query = `mimeType='application/vnd.google-apps.folder' and name='${folderName.replace(/'/g, "\\'")}' and trashed=false`;
      if (parentId) {
        query += ` and '${parentId}' in parents`;
      }

      const res = await drive.files.list({
        q: query,
        fields: "files(id, name)",
        spaces: "drive",
      });

      if (res.data.files && res.data.files.length > 0) {
        return res.data.files[0].id!;
      }

      // Create folder if not found
      const folderMetadata: any = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };
      if (parentId) {
        folderMetadata.parents = [parentId];
      }

      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: "id",
      });

      return folder.data.id!;
    }

    // 4. Create folder hierarchy
    const rootFolderId = await getOrCreateFolder("Notes Uploaded to Website");
    const subjectFolderId = await getOrCreateFolder(subtopic.module.subject.name, rootFolderId);
    const moduleFolderId = await getOrCreateFolder(`Module ${subtopic.module.moduleNo}: ${subtopic.module.title}`, subjectFolderId);
    const subtopicFolderId = await getOrCreateFolder(subtopic.title, moduleFolderId);

    // 5. Convert file to stream for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // 6. Upload file
    const fileMetadata = {
      name: file.name,
      parents: [subtopicFolderId],
    };
    const media = {
      mimeType: file.type,
      body: stream,
    };

    const uploadedFile = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    });

    const fileId = uploadedFile.data.id;

    if (!fileId) {
      throw new Error("Failed to upload file to Google Drive");
    }

    // 7. Make the file publicly viewable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // 8. Update Subtopic in database
    const updateData: any = {};
    if (resourceType === "notes") {
      updateData.notesUrl = uploadedFile.data.webViewLink;
      updateData.notesDownloadUrl = uploadedFile.data.webContentLink;
    } else if (resourceType === "quizFile") {
      updateData.quizFileUrl = uploadedFile.data.webViewLink;
      updateData.quizFileDownloadUrl = uploadedFile.data.webContentLink;
    } else if (resourceType === "mindMap") {
      updateData.mindMapUrl = uploadedFile.data.webViewLink;
      updateData.mindMapDownloadUrl = uploadedFile.data.webContentLink;
    } else if (resourceType === "flashCards") {
      updateData.flashCardsUrl = uploadedFile.data.webViewLink;
      updateData.flashCardsDownloadUrl = uploadedFile.data.webContentLink;
    } else if (resourceType === "reference") {
      updateData.referenceUrl = uploadedFile.data.webViewLink;
      updateData.referenceDownloadUrl = uploadedFile.data.webContentLink;
    } else if (resourceType === "other") {
      updateData.otherUrl = uploadedFile.data.webViewLink;
      updateData.otherDownloadUrl = uploadedFile.data.webContentLink;
    }

    const updatedSubtopic = await prisma.subtopic.update({
      where: { id: subtopicId },
      data: updateData,
    });

    return NextResponse.json({ success: true, subtopic: updatedSubtopic });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
