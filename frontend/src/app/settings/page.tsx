"use client";

import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {LocalStoreKey} from "@/lib/data";


export default function Settings() {
    const router = useRouter();

    return <section className="accessibility flex flex-col h-full w-full">
        <nav className="mt-4 w-full h-[44px] flex items-center px-4 gap-2 text-xl">
            <button onClick={() => router.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                    <path
                        d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
            </button>
            Settings
        </nav>
        <div className="flex-1 space-y-2 px-4 mt-5">
            <div className="w-full flex justify-between">
                Change font settings
                <button
                    onClick={() => {
                        router.push("/?page=accessibility");
                    }}
                    className="bg-brand-secondary w-[80px] px-2 py-1 rounded border-2 border-brand-secondary">Change</button>
            </div>
            <div className="w-full flex justify-between">
                Change language
                <button
                    className="bg-brand-secondary w-[80px] px-2 py-1 rounded border-2 border-brand-secondary"
                    onClick={() => {
                        router.push("/?page=lang");
                    }}
                >Change</button>
            </div>
            <div className="w-full flex justify-between">
                Logout from account <button
                className="bg-red-300 px-2 py-1 w-[80px] rounded border-2 border-red-400"
                onClick={() => {
                    localStorage.removeItem("user-session");
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/user/logout`, {
                        method: 'POST'
                    })
                        .then(res => res.json())
                        .then(() => {
                            localStorage.removeItem(LocalStoreKey);
                            toast.success("Logged out successfully");
                            router.push("/?page=login");
                        })
                        .catch(err => {
                            console.log(err);
                            toast.error("Failed to logout")
                        })
                }}
            >Logout</button>
            </div>
        </div>
    </section>
}