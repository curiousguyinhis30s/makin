import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
        const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");

        // Redirect non-authenticated users to login
        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Only allow ADMIN role to access /admin routes
        if (isAdminRoute && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // Redirect ADMIN users from dashboard to admin panel
        if (isDashboardRoute && token.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
