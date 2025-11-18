import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request) {
    const { isAuthenticated, getPermission, getClaim, getUser, getAccessToken } = getKindeServerSession();

    const authenticated = await isAuthenticated();
    const user = await getUser();
    const url = request.nextUrl.clone(); // Clone URL untuk modifikasi

    // Dapatkan roles dan permissions pengguna
    const roles = await getClaim("roles");
    const roleList = roles?.value?.map((r) => r.key) || [];
    const accessToken = await getAccessToken();
    const permissions = accessToken?.permissions || [];

    // --- Logging untuk Debugging (opsional, bisa dihapus di production) ---
    console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);
    console.log(`[Middleware] User: ${user?.email || 'Unknown'}`);
    console.log(`[Middleware] Authenticated: ${authenticated}`);
    console.log(`[Middleware] Role List: ${roleList.join(', ')}`);
    console.log(`[Middleware] Permissions: ${permissions.join(', ')}`);
    // --- Akhir Logging ---

    // Kontrol akses untuk /admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const hasAdminRole = roleList.includes("admin");
        const hasAdminPermission = permissions.includes("access:admin");

        // console.log(`[Middleware] Admin Check - Role: ${hasAdminRole}, Permission: ${hasAdminPermission}`);

        // Jika tidak terautentikasi atau tidak punya role/permission admin
        if (!authenticated || !hasAdminRole || !hasAdminPermission) {
            console.log(`[Middleware] Access denied to admin area for user: ${user?.email || "Unknown"}`);
            url.pathname = "/unauthorized"; // Redirect ke halaman unauthorized
            return NextResponse.redirect(url);
        }

        // Jika terautentikasi DAN punya akses admin, cek apakah pathnya adalah persis /admin
        if (request.nextUrl.pathname === "/admin") {
            console.log(`[Middleware] Redirecting admin ${user?.email} from /admin to /admin/dashboard`);
            url.pathname = "/admin/dashboard"; // Redirect ke dashboard admin
            return NextResponse.redirect(url);
        }

        // Jika pathnya bukan /admin (misal /admin/users), dan akses valid, lanjutkan
        console.log(`[Middleware] Access granted to admin area (${request.nextUrl.pathname}) for user: ${user?.email}`);
        return NextResponse.next(); // Izinkan akses ke path admin spesifik
    }

    // Kontrol akses untuk /voter
    if (request.nextUrl.pathname.startsWith("/voter")) {
        const hasVoterRole = roleList.includes("voter");

        // Jika tidak terautentikasi atau tidak punya role voter
        if (!authenticated || !hasVoterRole) {
            console.log(`[Middleware] Access denied to voter area for user: ${user?.email || "Unknown"}`);
            url.pathname = "/unauthorized"; // Redirect ke halaman unauthorized
            return NextResponse.redirect(url);
        }

        // Jika terautentikasi DAN punya akses voter, cek apakah pathnya adalah persis /voter
        if (request.nextUrl.pathname === "/voter") {
            console.log(`[Middleware] Redirecting voter ${user?.email} from /voter to /voter/dashboard`);
            url.pathname = "/voter/dashboard"; // Redirect ke dashboard voter
            return NextResponse.redirect(url);
        }

        // Jika pathnya bukan /voter (misal /voter/profile), dan akses valid, lanjutkan
        console.log(`[Middleware] Access granted to voter area (${request.nextUrl.pathname}) for user: ${user?.email}`);
        return NextResponse.next(); // Izinkan akses ke path voter spesifik
    }

    // Jika path tidak cocok dengan /admin/* atau /voter/* (seharusnya tidak terjadi karena matcher)
    return NextResponse.next();
}

export const config = {
    // Pastikan matcher mencakup path dasar (/admin dan /voter) serta sub-pathnya
    matcher: ["/admin", "/admin/:path*", "/voter", "/voter/:path*"],
};