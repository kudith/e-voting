import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request) {
    const { isAuthenticated, getPermission, getClaim, getUser, getAccessToken } = getKindeServerSession();

    const authenticated = await isAuthenticated();
    const user = await getUser();
    const url = request.nextUrl.clone();

    // Log user information
    const accessToken = await getAccessToken();
    console.log(`[Access Token] Decoded Token:`, accessToken);

    // Check role claims (array of roles)
    const roles = await getClaim("roles");
    const roleList = roles?.value?.map((r) => r.key) || [];

    // Handle callback URL
    if (request.nextUrl.pathname.startsWith("/api/auth/kinde_callback")) {
        return NextResponse.next();
    }

    // Handle root path and dashboard redirection
    if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/dashboard") {
        if (!authenticated) {
            return NextResponse.next();
        }

        const hasAdminPermission = accessToken.permissions?.includes("access:admin");
        const hasAdminRole = roleList.includes("admin");
        const hasVoterRole = roleList.includes("voter");

        if (hasAdminPermission && hasAdminRole) {
            url.pathname = "/admin/dashboard";
            return NextResponse.redirect(url);
        } else if (hasVoterRole) {
            url.pathname = "/voter/dashboard";
            return NextResponse.redirect(url);
        } else {
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }
    }

    // Access control for /admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const hasAdminPermission = accessToken.permissions?.includes("access:admin");
        const hasAdminRole = roleList.includes("admin");

        if (!authenticated || !hasAdminPermission || !hasAdminRole) {
            console.log(
                `[Access Denied] Admin access required. User: ${user?.email || "Unknown"}`
            );
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        } else {
            console.log(`[Access Granted] Admin access. User: ${user?.email}`);
        }
    }

    // Access control for /voter
    if (request.nextUrl.pathname.startsWith("/voter")) {
        const hasVoterRole = roleList.includes("voter");

        if (!authenticated || !hasVoterRole) {
            console.log(
                `[Access Denied] Voter role required. User: ${user?.email || "Unknown"}`
            );
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        } else {
            console.log(`[Access Granted] Voter access. User: ${user?.email}`);
        }
    }

    // Allow other requests
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/api/auth/kinde_callback", "/admin/:path*", "/voter/:path*"],
};