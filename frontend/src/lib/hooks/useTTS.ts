import { useEffect, useState, useRef } from "react";

function sendTtsText(
    ttsSocketRef: React.MutableRefObject<WebSocket | null>,
    text: string,
    lang: string,
    beforeMsgSend: () => void,
    onMessageReceived: (response: any) => void
) {
    beforeMsgSend();

    if (!ttsSocketRef.current || ttsSocketRef.current.readyState !== WebSocket.OPEN) {
        // Initialize WebSocket if it doesn't exist or is closed
        ttsSocketRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BACKEND}/v1/ws/speech`);
        ttsSocketRef.current.onopen = () => {
            console.log("TTS WebSocket connected");
            ttsSocketRef.current!.send(
                JSON.stringify({
                    text,
                    language: lang,
                })
            );
        };
    } else {
        // Send the text directly if the WebSocket is already open
        ttsSocketRef.current.send(
            JSON.stringify({
                text,
                language: lang,
            })
        );
    }

    // Handle incoming messages
    ttsSocketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message from WebSocket:", message);

        // Play audio if available
        if (message.audio) {
            console.log("Received TTS audio data");
            playTtsAudio(message.audio);
        }

        // Pass the message data back to the callback for handling
        onMessageReceived(message);
    };

    // Handle WebSocket closure
    ttsSocketRef.current.onclose = () => {
        console.log("TTS WebSocket disconnected");
    };
}

function playTtsAudio(audioBase64: string) {
    const audioBytes = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0));
    const audioContext = new AudioContext();

    // Decode and play the audio
    audioContext.decodeAudioData(audioBytes.buffer, (buffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start();
    });

    console.log("Audio playback started");
}

export default function useTTS(
    lang: string,
    beforeMsgSend: () => void,
    onMessageReceived: (message: any) => void
) {
    const [text, setText] = useState<string>("");
    const ttsSocketRef = useRef<WebSocket | null>(null); // Persist WebSocket across renders

    // Effect to process sentences and send them via TTS
    useEffect(() => {
        const sentenceEndings = /[.?!]/g;
        const sentences = text.split(sentenceEndings);

        if (sentences.length > 1) {
            // Send everything except the last sentence
            const buffer =
                sentences.slice(0, -1).join(".") +
                text.match(sentenceEndings)?.slice(0, -1).join("");

            let currText = sentences[sentences.length - 1];
            setText(() => currText); // Set the remaining sentence as the text state
            sendTtsText(ttsSocketRef, buffer, lang, beforeMsgSend, onMessageReceived); // Send the buffered text
        }
    }, [beforeMsgSend, lang, text]);

    // Return functions and state for controlling the TTS feature
    return {
        text,
        setText,
        sendText: (inputText: string) => {
            sendTtsText(ttsSocketRef, inputText, lang, beforeMsgSend, onMessageReceived); // Send full input text
        },
    };
}