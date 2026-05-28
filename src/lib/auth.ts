import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
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

      if (account) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (dbUser) {
          const updateData: any = {
            access_token: account.access_token,
            expires_at: account.expires_at,
            scope: account.scope,
          };
          if (account.refresh_token) {
            updateData.refresh_token = account.refresh_token;
          }
          await prisma.account.updateMany({
            where: { userId: dbUser.id, provider: account.provider },
            data: updateData
          });
        }
      }

      const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@example.com";

      if (user.email === adminEmail) {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser && existingUser.role !== "faculty") {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "faculty" },
          });
        } else if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "Admin",
              image: user.image,
              role: "faculty",
            },
          });
        }
      }

      // Allow all other sign ups/ins to pass through.
      // PrismaAdapter will create a new user if they don't exist, defaulting to 'student'
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
