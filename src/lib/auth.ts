import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@example.com";

      let dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      const tokensData: any = {};
      if (account) {
        if (account.access_token) tokensData.googleAccessToken = account.access_token;
        if (account.refresh_token) tokensData.googleRefreshToken = account.refresh_token;
      }

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name || "Student",
            image: user.image,
            role: user.email === adminEmail ? "faculty" : "student",
            ...tokensData
          },
        });
      } else {
        const updateData = { ...tokensData };
        if (user.email === adminEmail && dbUser.role !== "faculty") {
          updateData.role = "faculty";
        }
        
        if (Object.keys(updateData).length > 0) {
          dbUser = await prisma.user.update({
            where: { email: user.email },
            data: updateData,
          });
        }
      }

      // Attach DB info to the user object so it flows into the JWT token
      user.id = dbUser.id;
      (user as any).role = dbUser.role;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "student";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

import { getServerSession } from "next-auth/next";

export async function getOrCreateUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  return await prisma.user.findUnique({
    where: { email: session.user.email }
  });
}
