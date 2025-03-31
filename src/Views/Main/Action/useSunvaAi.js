import { useState, useEffect } from "react";
import RecordRTC from "recordrtc";
import { toast } from "react-toastify";
import useCommonState, { useDispatch } from "ResuableFunctions/CustomHooks";
import { updateAudioToTextMessages, updateIsRecording } from "../Slice/MainSlice";
import axiosInstance from "Services/axiosInstance";
import { useLocation } from "react-router-dom";

let transcribeAndProcessSocket = null;
let recorder;
const audioQueue = [];
let isSending = false;

const useSunvaAI = (session) => {
    const [isActive, setIsActive] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [messages, setMessages] = useState([]);
    const dispatch = useDispatch();
    const location = useLocation();
    const { mainState } = useCommonState();

    const checkIsAlive = async () => {
        try {
            const { data } = await axiosInstance.get('/is-alive');
            if (data?.status === "alive") return "active";
        } catch (err) {
            console.error("Error checking server status:", err);
            return "inactive";
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    async function startRecording() {
        let status = await checkIsAlive();
        if (status === "active")
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                dispatch(updateAudioToTextMessages({ type: "request" }));
                recorder = new RecordRTC(stream, {
                    type: "audio",
                    recorderType: RecordRTC.StereoAudioRecorder,
                    mimeType: "audio/wav",
                    numberOfAudioChannels: 1,
                    desiredSampRate: 16000,
                    timeSlice: 5000,
                    ondataavailable: (blob) => {
                        if (blob && blob.size > 0) {
                            audioQueue.push(blob);
                            sendAudioChunks();
                        }
                    },
                });

                setIsActive("active");
                dispatch(updateIsRecording(true));
                recorder.startRecording();
                console.log("Recording started");
            } catch (error) {
                console.error("Error accessing microphone", error);
                toast.error("Error accessing microphone");
                setIsRecording(false);
                setIsActive("inactive");
            }
        else {
            setIsActive("inactive");
            toast.error("Server is not active");
        }
    }

    function stopRecording() {
        dispatch(updateIsRecording(false));

        console.log("Stopping recording...");
        if (recorder && recorder.getState() !== "inactive") {
            recorder.stopRecording(() => {
                sendAudioChunks();
            });
        }
    }

    async function sendAudioChunks() {
        if (audioQueue.length > 0 && !isSending) {
            isSending = true;
            const audioBlob = audioQueue.shift();
            if (!audioBlob) return;

            const arrayBuffer = await audioBlob.arrayBuffer();
            const base64String = arrayBufferToBase64(arrayBuffer);
            const data = JSON.stringify({
                audio: base64String,
                language: session?.lang || "en",
                user_id: session?.user_id || "0",
            });

            transcribeAndProcessSocket?.send(data);
            isSending = false;
            sendAudioChunks();
        }
    }

    function startTranscriptionAndProcessing() {
        try {
            if (transcribeAndProcessSocket) {
                transcribeAndProcessSocket.close();
                console.log("Closing existing WebSocket connection...");
            }

            transcribeAndProcessSocket = new WebSocket(`${process.env.REACT_APP_WS_URI}/v1/ws/transcription`);

            transcribeAndProcessSocket.onopen = () => {
                console.log("WebSocket connected");
                startRecording();
            };

            transcribeAndProcessSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (!data.text) return;
                dispatch(updateAudioToTextMessages({ type: "response", data }))
            };

            transcribeAndProcessSocket.onclose = () => {
                setIsRecording(false);
                setIsActive("inactive");
                console.log("WebSocket disconnected");
            };

            transcribeAndProcessSocket.onerror = () => {
                setIsRecording(false);
                setIsActive("inactive");
                toast.error("Couldn't connect to the server");
            };
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        return () => {
            if (transcribeAndProcessSocket) {
                console.log("Closing WebSocket on route change");
                stopRecording();
                transcribeAndProcessSocket.close();
                transcribeAndProcessSocket = null;
            }
        };
    }, [location]);

    return {
        isActive,
        isRecording,
        messages,
        setMessages,
        startRecording: startTranscriptionAndProcessing,
        stopRecording,
    };
};

export default useSunvaAI;