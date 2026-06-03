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

      const adminEmail = process.env.INITIAL_ADMIN_EMAIL;

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
        const updateData: any = { ...tokensData };
        if (user.email === adminEmail && dbUser.role !== "faculty") {
          updateData.role = "faculty";
        }

        // Streak calculation
        const now = new Date();
        if (!dbUser.lastActiveDate) {
          updateData.lastActiveDate = now;
          updateData.streak = 1;
        } else {
          const lastActive = new Date(dbUser.lastActiveDate);
          
          // Reset times to midnight to compare exact calendar days
          const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const lastActiveMidnight = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
          
          const diffTime = todayDate.getTime() - lastActiveMidnight.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) {
            // Logged in yesterday, increment streak
            updateData.streak = (dbUser.streak || 0) + 1;
            updateData.lastActiveDate = now;
          } else if (diffDays > 1) {
            // Missed a day, reset streak to 0
            updateData.streak = 0;
            updateData.lastActiveDate = now;
          }
          // If diffDays === 0, they already logged in today, do nothing
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

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!dbUser) return null;

  // Streak calculation on page load (so it works without re-login)
  const now = new Date();
  const updateData: any = {};

  if (!dbUser.lastActiveDate) {
    updateData.lastActiveDate = now;
    updateData.streak = 1;
    updateData.maxStreak = 1;
  } else {
    const lastActive = new Date(dbUser.lastActiveDate);
    
    // Reset times to midnight to compare exact calendar days
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActiveMidnight = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
    
    const diffTime = todayDate.getTime() - lastActiveMidnight.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays === 1) {
      // Logged in yesterday, increment streak
      updateData.streak = (dbUser.streak || 0) + 1;
      updateData.lastActiveDate = now;
    } else if (diffDays > 1) {
      // Missed a day, reset streak to 0
      updateData.streak = 0;
      updateData.lastActiveDate = now;
    }

    // Update max streak if current streak is higher
    if (updateData.streak && updateData.streak > (dbUser.maxStreak || 0)) {
      updateData.maxStreak = updateData.streak;
    }
  }

  if (Object.keys(updateData).length > 0) {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData
    });
    return updatedUser;
  }

  // If we didn't update it, but they didn't login today, their streak shouldn't show as high on the frontend if it's broken.
  // Wait, if they missed yesterday, and diffDays > 1, the DB updates to streak = 1.
  // What if diffDays === 0? Then no update needed, return dbUser.

  return dbUser;
}
