import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request) {
    const { isAuthenticated, getPermission, getClaim, getUser, getAccessToken } = getKindeServerSession();

    const authenticated = await isAuthenticated();
    const user = await getUser();
    const url = request.nextUrl.clone();

    // Get user roles and permissions
    const roles = await getClaim("roles");
    const roleList = roles?.value?.map((r) => r.key) || [];
    const accessToken = await getAccessToken();
    const permissions = accessToken?.permissions || [];

    console.log(`[Middleware] User: ${user?.email || 'Unknown'}`);
    console.log(`[Middleware] Roles: ${JSON.stringify(roles)}`);
    console.log(`[Middleware] Role List: ${roleList.join(', ')}`);
    console.log(`[Middleware] Permissions: ${permissions.join(', ')}`);
    console.log(`[Middleware] Access Token: ${JSON.stringify(accessToken)}`);

    // Allow access to root path for everyone
    if (request.nextUrl.pathname === "/") {
        return NextResponse.next();
    }

    // Access control for /admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const hasAdminRole = roleList.includes("admin");
        const hasAdminPermission = permissions.includes("access:admin");

        console.log(`[Middleware] Admin Check - Role: ${hasAdminRole}, Permission: ${hasAdminPermission}`);

        if (!authenticated || !hasAdminRole || !hasAdminPermission) {
            console.log(`[Middleware] Access denied to admin area for user: ${user?.email || "Unknown"}`);
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }
        console.log(`[Middleware] Access granted to admin area for user: ${user?.email}`);
    }

    // Access control for /voter
    if (request.nextUrl.pathname.startsWith("/voter")) {
        const hasVoterRole = roleList.includes("voter");

        if (!authenticated || !hasVoterRole) {
            console.log(`[Middleware] Access denied to voter area for user: ${user?.email || "Unknown"}`);
            url.pathname = "/unauthorized";
            return NextResponse.redirect(url);
        }
        console.log(`[Middleware] Access granted to voter area for user: ${user?.email}`);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/voter/:path*"],
};