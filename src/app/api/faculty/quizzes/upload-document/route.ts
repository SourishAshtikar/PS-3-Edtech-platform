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

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // 1. Get Google Account tokens from User model
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.googleAccessToken) {
      return NextResponse.json({ error: "Google Drive not connected or tokens missing" }, { status: 403 });
    }

    // 2. Initialize Google Drive client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: dbUser.googleAccessToken,
      refresh_token: dbUser.googleRefreshToken,
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

    // 3. Create folder hierarchy
    const rootFolderId = await getOrCreateFolder("Notes Uploaded to Website");
    const quizzesFolderId = await getOrCreateFolder("Quizzes", rootFolderId);

    // 4. Convert file to stream for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    // 5. Upload file
    const fileMetadata = {
      name: file.name,
      parents: [quizzesFolderId],
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

    // 6. Make the file publicly viewable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return NextResponse.json({ 
      success: true, 
      url: uploadedFile.data.webViewLink,
      downloadUrl: uploadedFile.data.webContentLink
    });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
