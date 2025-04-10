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

    // Access control for /dashboard
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
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
    matcher: ["/admin", "/admin/:path*", "/dashboard", "/dashboard/:path*"],
};