"use client";

import "./home.css"
import {KeyboardIcon, MicroPhoneIcon, SettingsIcon, StopIcon, TrashIcon, UpAndDownArrow} from "@/components/Icons";
import {useCallback, useState} from "react";
import MessagesList from "@/components/MessageList";
import Link from "next/link";
import useSunvaAI from "@/lib/hooks/useSunvaAI";
import TTS from "@/components/tts/TTS";
import {useSession} from "@/lib/context/sessionContext";
import {SaveAndDeletePrompts} from "@/components/SaveAndDeletePrompts";
import {History} from "lucide-react";
import NavbarMenu from "@/components/NavbarMenu";


export default function Home() {
    const [session] = useSession();
    const {
        messages,
        setMessages,
        isRecording,
        setIsRecording,
        isActive,
        startRecording,
        stopRecording
    } = useSunvaAI(session);
    const [isTTSOpen, setIsTTSOpen] = useState(false);
    const [isDelOpen, setIsDelOpen] = useState(false);
    const ttsClose = useCallback(() => {
        setIsTTSOpen(false);
    }, []);

    return <main className="accessibility flex justify-between flex-col w-full h-full px-4 pt-3 pb-4">
        <div className="w-full h-[40px] flex items-center justify-between mt-2" onClick={() => {
            ttsClose();
        }}>
            <div className="text-center flex items-center justify-center">
                <div className="py-1 bg-white rounded-full flex items-center gap-2 px-3">
                    <img src="/sunva.webp" className="h-[40px]" alt="Sunva Logo - People+ai; An EkStep initiative"
                         draggable={false}/>
                    <img src="/sunva-text.webp" className="h-4" alt="Sunva"/>
                </div>
            </div>
            <div className={`py-1 bg-white rounded-full flex items-center gap-4 text-gray-800 px-4 status-indicator ${isActive}`}>
                <Link href="/home/saved" className="w-[24px]">
                    <History />
                </Link>
                <NavbarMenu/>
            </div>
        </div>

        <MessagesList messages={messages} onClick={ttsClose}/>

        {isTTSOpen ? <TTS setMessages={setMessages} onClose={ttsClose}/> :
            <div className="px-5 h-[75px] py-1 bg-white shadow flex rounded-3xl gap-7 justify-evenly items-center">
                <Link href="/settings">
                    <SettingsIcon/>
                </Link>
                <button onClick={() => setIsDelOpen(true)}><TrashIcon/></button>
                <button
                    className={`h-[65%] aspect-square rounded-full flex items-center justify-center record-btn ${isRecording ? 'recording' : ''}`}
                    onClick={() => {
                        setIsRecording((prev) => !prev);

                        if (isRecording) {
                            stopRecording();
                        } else {
                            startRecording();
                        }
                    }}
                >
                    {isRecording ? <StopIcon/> : <MicroPhoneIcon/>}
                </button>
                <button onClick={() => {
                    setIsTTSOpen(true);
                    setIsRecording(false);
                    stopRecording();
                }}>
                    <KeyboardIcon/>
                </button>
                <UpAndDownArrow/>
            </div>}

        <SaveAndDeletePrompts isDelOpen={isDelOpen} setIsDelOpen={setIsDelOpen} session={session}/>
    </main>
}