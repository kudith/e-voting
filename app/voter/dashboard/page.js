"use client";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs";

export default function DashboardPage() {
    const {user, getUser} = useKindeBrowserClient();
    const alsoUser = getUser();

    console.log(user);

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.given_name}!</h1>
            <LogoutLink
                className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
                Logout
            </LogoutLink>
        </div>
    );
}
