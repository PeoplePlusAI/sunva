import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'ResuableFunctions/CustomHooks';
import axiosInstance from 'Services/axiosInstance';
import { languageCodeFinder } from 'Utils/JsonData';
import { updateToast } from 'Views/Common/Slice/Common_slice';
import {
    update_font_page_details,
    UpdateTextToSpeechData,
    updateAudioData,

    updateTranscriptionsRequest,
    updateTranscriptionsResponse,
    updateTranscriptionsFailure,

    updateIndividualTranscriptionsRequest,
    updateIndividualTranscriptionsResponse,
    updateIndividualTranscriptionsFailure,
} from 'Views/Main/Slice/MainSlice';

export const handle_font_data_onchange = params => dispatch => {
    dispatch(update_font_page_details(params));
}

//--------------------------------------------------------------------------------------TTS transcription page-----------------------------------------------------------------------------------
export default function useTTS(user_id, language, gender, beforeMsgSend) {
    const ttsSocket = useRef(null);
    const dispatch = useDispatch();
    const text = useSelector((state) => state.mainState.text_to_speech) || "";

    useEffect(() => {
        return () => {
            if (ttsSocket.current) {
                console.log("Closing WebSocket on unmount...");
                dispatch(UpdateTextToSpeechData({ type: 'failure' }))
                ttsSocket.current.close();
                ttsSocket.ttsSocketcurrent = null;
            }
        };
    }, []);

    return {
        sendText: () => {
            if (!text.trim()) {
                dispatch(updateToast({ message: 'Input is empty', type: 'error' }));
                return;
            }

            SendTtsText({ language, user_id, text, gender }, beforeMsgSend, ttsSocket, dispatch);
        },
    };
}

function SendTtsText(params, beforeMsgSend, ttsSocket, dispatch) {
    dispatch(UpdateTextToSpeechData({ type: 'request' }));

    const WS_URL = process.env.REACT_APP_WS_URI;
    if (!WS_URL) {
        console.error("WebSocket URL is missing! Check .env file.");
        return;
    }

    if (!ttsSocket.current || ttsSocket.current.readyState >= WebSocket.CLOSING) {
        console.warn("Creating new WebSocket connection...");
        if (ttsSocket.current) {
            console.log("Closing the previous WebSocket connection.");
            ttsSocket.current.close();
        }

        ttsSocket.current = new WebSocket(`${WS_URL}/v1/ws/speech`);

        ttsSocket.current.onopen = () => {
            console.log("TTS WebSocket connected");
            beforeMsgSend();
            ttsSocket.current.send(JSON.stringify(params));
        };

        ttsSocket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            dispatch(UpdateTextToSpeechData({ type: 'response', data: message }));
        };

        ttsSocket.current.onclose = (event) => {
            console.warn(`WebSocket closed: ${event.reason || "No reason provided"}`);
            if (ttsSocket.current) {
                ttsSocket.current = null;
            }
        };

        ttsSocket.current.onerror = (error) => {
            console.error("WebSocket Error:", error);
            if (ttsSocket.current) {
                ttsSocket.current.close();
                ttsSocket.current = null;
            }
            dispatch(UpdateTextToSpeechData({ type: 'failure' }));
        };
    } else if (ttsSocket.current.readyState === WebSocket.OPEN) {
        beforeMsgSend();
        ttsSocket.current.send(JSON.stringify(params));
    }
}

let audioSource = null;
export const playTtsAudio = params => dispatch => {
    try {
        dispatch(updateAudioData(params))
        const audioBytes = Uint8Array.from(atob(params?.audioBase64), (c) => c.charCodeAt(0));
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === "suspended") {
            document.body.addEventListener("click", () => audioContext.resume(), { once: true });
        }

        audioContext.decodeAudioData(audioBytes.buffer)
            .then((buffer) => {
                if (audioSource) {
                    audioSource.stop();
                    audioSource.disconnect();
                }

                audioSource = audioContext.createBufferSource();
                audioSource.buffer = buffer;
                audioSource.connect(audioContext.destination);
                audioSource.start();

                audioSource.onended = () => {
                    audioSource = null;
                    dispatch(updateAudioData({}))
                };
            })
            .catch((err) => console.error("Audio decoding error:", err));

    } catch (err) {
        console.error("Audio playback error:", err);
    }
}

export const stopTtsAudio = () => dispatch => {
    dispatch(updateAudioData({}))
    if (audioSource) {
        audioSource.stop();
        audioSource.disconnect();
        audioSource = null;
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------                                 




export const handleSaveTranscription = params => async (dispatch, getState) => {
    try {
        const res = await axiosInstance.post(`/v1/transcription/save?user_id=${getState().commonState?.user_id}&language=${languageCodeFinder(getState().commonState?.selected_language)}`)

        if (res.status === 200)
            dispatch(updateToast({ message: "Transcription saved successfully", type: "success" }))
        else
            dispatch(updateToast({ message: res?.data?.details, type: "error" }))

    } catch (Err) {
        dispatch(updateToast({ message: Err?.response?.data?.detail, type: "error" }))
    }
}

export const handleGetAllTranscription = params => async (dispatch) => {
    try {
        dispatch(updateTranscriptionsRequest())
        const res = await axiosInstance.get(`/v1/transcriptions`);
        if (res.status === 200)
            dispatch(updateTranscriptionsResponse(res.data))
        else
            dispatch(updateTranscriptionsFailure({ message: res?.data?.details, type: "error" }))
    } catch (Err) {
        dispatch(updateTranscriptionsFailure({ message: Err?.message, type: "error" }))
    }
}

export const handleGetIndividualTranscription = params => async (dispatch) => {
    try {
        dispatch(updateIndividualTranscriptionsRequest())
        const res = await axiosInstance.get(`/v1/transcriptions/${params}`);
        if (res.status === 200)
            dispatch(updateIndividualTranscriptionsResponse(res.data))
        else
            dispatch(updateIndividualTranscriptionsFailure({ message: res?.data?.details, type: "error" }))
    } catch (Err) {
        dispatch(updateIndividualTranscriptionsFailure({ message: Err?.message, type: "error" }))
    }
}