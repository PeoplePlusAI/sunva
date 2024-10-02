"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {NoteIcon} from "@/components/Icons";
import {formatTime} from "@/lib/utils";

type TSaved = {
    ID: number;
    title: string;
    unix_date: number;
}

export default function Chats() {
    const router = useRouter();
    const [saved] = useState<TSaved[]>([
        {
            ID: 112,
            title: "Conversation 1",
            unix_date: Date.now()
        }, {
            ID: 543,
            title: "Conversation 2",
            unix_date: Date.now() - 10000,
        }, {
            ID: 876,
            title: "Conversation 3",
            unix_date: Date.now() - 987624,
        }
    ]);

    return <section className="accessibility flex flex-col h-full w-full">
        <nav className="mt-4 w-full h-[44px] flex items-center px-4 gap-2 text-xl">
            <button onClick={() => router.back()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                    <path
                        d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                </svg>
            </button>
            Conversations
        </nav>
        <div className="flex-1 space-y-2 px-4 mt-5">
            {saved.map((item, i) => {
                return <div key={i} className="flex bg-white px-4 py-4 rounded-xl gap-2">
                <NoteIcon/>
                    <h2 className="flex-1 font-bold">{item.title}</h2>
                    <span>{formatTime(item.unix_date)}</span>
                </div>
            })}
        </div>
    </section>
}