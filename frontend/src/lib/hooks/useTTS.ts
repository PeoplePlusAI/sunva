import {useEffect, useState} from "react";
import {IUserSession, useSession} from "@/lib/context/sessionContext";

function sendTtsText(text: string, session: IUserSession, beforeMsgSend: () => void) {
    beforeMsgSend();
    let ttsSocket: WebSocket;

    // @ts-ignore
    if (!ttsSocket || ttsSocket.readyState !== WebSocket.OPEN) {
        ttsSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BACKEND}/v1/ws/speech`);
        ttsSocket.onopen = () => {
            console.log("TTS WebSocket connected");
            ttsSocket.send(JSON.stringify({
                text,
                language: session.lang,
                gender: session.voice_model
            }));
        };
    } else {
        ttsSocket.send(text);
    }

    ttsSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        if (message.audio) {
            console.log("Received TTS audio data");
            playTtsAudio(message.audio);
        }
    };

    ttsSocket.onclose = () => {
        console.log("TTS WebSocket disconnected");
    };
}

function playTtsAudio(audioBase64: any) {
    const audioBytes = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(audioBytes.buffer, buffer => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
    });

    console.log("Reached here");
}

export default function useTTS(lang: string, beforeMsgSend: () => void) {
    const [text, setText] = useState('');
    const [session] = useSession();

    useEffect(() => {
        const sentenceEndings = /[.?!]/g;
        const sentences = text.split(sentenceEndings);

        if (sentences.length > 1) {
            const buffer = sentences.slice(0, -1).join('.') + text.match(sentenceEndings)?.slice(0, -1).join('');
            let currText = sentences[sentences.length - 1];
            setText(() => currText);
            sendTtsText(buffer, session!, beforeMsgSend);
        }
    }, [beforeMsgSend, lang, text]);

    return {
        text,
        setText,
        sendText: (text: string) => {
            sendTtsText(text, session!, beforeMsgSend);
        }
    }
}