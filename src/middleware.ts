import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;
      
      // Protect /student routes
      if (path.startsWith("/student")) {
        return !!token;
      }
      
      // Protect /faculty routes
      if (path.startsWith("/faculty")) {
        return token?.role === "faculty";
      }
      
      return true; // Let everything else through
    },
  },
});

export const config = {
  matcher: ["/student/:path*", "/faculty/:path*"],
};
