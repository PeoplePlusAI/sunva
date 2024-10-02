import {useEffect, useState} from "react";
import {StateSetter, TMessage, TServerStates} from "@/lib/types";
import RecordRTC from "recordrtc";
import {arrayBufferToBase64} from "@/lib/sunva-ai";
import {toast} from "sonner";
import {TSessionCtx} from "@/lib/context/sessionContext";

let transcribeAndProcessSocket: WebSocket | null;
let recorder: RecordRTC;
const audioQueue: Blob[] = [];
let isSending = false;


async function startRecording(setRecording: StateSetter<boolean>, setIsActive: StateSetter<TServerStates>, session: TSessionCtx) {
    console.group("Record Start")
    try {
        console.log('Starting recording...');
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        console.log('Microphone access granted');

        recorder = new RecordRTC(stream, {
            type: 'audio',
            recorderType: RecordRTC.StereoAudioRecorder,
            mimeType: 'audio/wav',
            numberOfAudioChannels: 1,  // Mono channel is sufficient for speech recognition
            desiredSampRate: 16000,
            timeSlice: 5000, // Get data every 5 seconds
            ondataavailable: (blob) => {
                if (blob && blob.size > 0) {
                    audioQueue.push(blob);
                    sendAudioChunks(session);
                }
            },
        });

        setIsActive("active");
        recorder.startRecording();
        console.log('Recording started');
    } catch (error) {
        console.error("Error accessing microphone");
        toast.error("Error accessing microphone");
        setRecording(false);
        setIsActive("inactive");
    }
    console.groupEnd();
}

function stopRecording(session: TSessionCtx) {
    console.log('Stopping recording...');
    if (recorder && recorder.getState() !== 'inactive') {
        recorder.stopRecording(() => {
            sendAudioChunks(session);
        });
    }
}

async function sendAudioChunks(session: TSessionCtx) {
    if (audioQueue.length > 0 && !isSending) {
        console.group("Send Audio");

        isSending = true;
        const audioBlob = audioQueue.shift();
        if (!audioBlob)
            return;

        const arrayBuffer = await audioBlob.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);
        const data = JSON.stringify({
            audio: base64String,
            language: session?.lang || 'en',
            user_id: session?.user_id || '0'
        });
        console.log('Sending audio data to server');
        transcribeAndProcessSocket?.send(data);
        console.log('Sent audio data to server');
        isSending = false;
        sendAudioChunks(session);  // Continue sending remaining chunks
        console.groupEnd();
    } else {
        console.warn('No audio chunks to send');
    }
}

interface IServerRes {
    type: "transcription" | "concise" | "highlight";
    text: string;
    message_id: string
}

function startTranscriptionAndProcessing(
    setMessages: StateSetter<TMessage[]>,
    setIsRecording: StateSetter<boolean>,
    setIsActive: StateSetter<TServerStates>,
    session: TSessionCtx
) {
    try {
        if (transcribeAndProcessSocket)
            transcribeAndProcessSocket.close();
        transcribeAndProcessSocket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BACKEND}/v1/ws/transcription`);

        transcribeAndProcessSocket.onopen = () => {
            console.log('Transcription and Processing WebSocket connected');
            startRecording(setIsRecording, setIsActive, session);
        };

        transcribeAndProcessSocket.onmessage = (event) => {
            const data = JSON.parse(event.data) as IServerRes;
            console.log("Received Data:", data);

            if (!data.text) {
                console.warn("The server returned empty string; skipping this.");
                return;
            }

            setMessages((prevState) => {
                console.log("%c===========State Update============", "color:red;font-size:30px")
                console.log("TIME:", Date.now());

                // Find if the message with same ID already exists.
                const index = prevState.findIndex(message => message.id === data.message_id);

                if (data.type === "transcription") {
                    if (index !== -1) {
                        const updatedMessages = [...prevState];
                        updatedMessages[index].message = `${updatedMessages[index].message} ${data.text}`;
                        return updatedMessages;
                    }

                    return [
                        ...prevState,
                        {name: "Person 1", message: data.text, id: data.message_id}
                    ];
                }

                // If the data type is "concise" or "highlight", update the summarized text or add a new message.
                if (data.type === "concise" || data.type === "highlight") {
                    if (index !== -1) {
                        const updatedMessages = [...prevState];
                        updatedMessages[index].modified = data.text;
                        updatedMessages[index].type = data.type;
                        return updatedMessages;
                    }
                    return [
                        ...prevState,
                        {name: "Person 1", message: data.text, modified: data.text, id: data.message_id}
                    ];
                }
                // Throw an error for any undefined data type.
                throw new Error("Undefined type found in the server response: " + data.type);
            });
        };

        transcribeAndProcessSocket.onclose = (e) => {
            setIsRecording(false);
            if (!e.wasClean) {
                console.error("Connection to server closed unexpectedly")
                setIsActive("inactive");
                toast.error("Connection to server closed unexpectedly");
            }
            console.log('Transcription and Processing WebSocket disconnected');
            stopRecording(session);
            transcribeAndProcessSocket = null;
        };

        transcribeAndProcessSocket.onerror = () => {
            setIsRecording(false);
            setIsActive("inactive");
            toast.error("Couldn't connect to the server");
            transcribeAndProcessSocket = null;
        }
    } catch (e) {
        console.log("Error:", e);
        transcribeAndProcessSocket?.close();
        transcribeAndProcessSocket = null;
        setIsRecording(false);
    }
}

function stopTranscriptionAndProcessing(session: TSessionCtx) {
    if (transcribeAndProcessSocket) {
        transcribeAndProcessSocket.close();
        transcribeAndProcessSocket = null;
    }
    stopRecording(session);
}

export default function useSunvaAI(session: TSessionCtx) {
    const [isActive, setIsActive] = useState<TServerStates>("active");
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState<TMessage[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/is-alive`, {
            headers: {},
            mode: "no-cors"
        })
            .then(() => {
                setIsActive("active");
            })
            .catch(error => {
                setIsActive("inactive");
                console.error("Server is not available", error);
            });
    }, []);

    function startRecording() {
        startTranscriptionAndProcessing(setMessages, setIsRecording, setIsActive, session);
    }

    function stopRecording() {
        stopTranscriptionAndProcessing(session);
    }

    return {
        isActive,
        setIsActive,
        isRecording,
        setIsRecording,
        messages,
        setMessages,
        startRecording,
        stopRecording
    }
}