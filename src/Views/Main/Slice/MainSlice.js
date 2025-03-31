import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { logout } from "Views/Common/Slice/Common_slice";

export const MainSlice = createSlice({
    name: 'Main_slice',
    initialState: {
        font_page_details: Cookies.get('font_page_details') ? JSON.parse(Cookies.get('font_page_details')) : {},
        text_to_speech_gender: sessionStorage.getItem('tts_gender') || 'Male',
        text_to_speech: '',
        disable_text_to_speech_typing: false,
        text_to_speech_data: [],
        audio_data: {},

        recorder_modal: false,
        is_recording: false,
        VisualizerData: [],
        audio_url: null,

        is_highlighted: false,
        audio_to_text_messages: [],
        all_transcriptions: [],
        selected_transcriptions: []
    },
    reducers: {
        update_font_page_details(state, action) {
            if (action.payload) {
                Cookies.set('font_page_details', JSON.stringify(action.payload))
            }

            return {
                ...state,
                font_page_details: {
                    ...state?.font_page_details,
                    ...action.payload
                }
            }
        },

        // TEXT TO SPEECH INPUT 
        updateTextToSpeech(state, action) {
            return {
                ...state,
                text_to_speech: action.payload
            }
        },

        // TEXT TO SPEECH GENDER UPDATE
        updateTtsGender(state, action) {
            if (action.payload) sessionStorage.setItem('tts_gender', action?.payload)
            return {
                ...state,
                text_to_speech_gender: action.payload
            }
        },

        //TEXT TO SPEECH CONVERSIONS DATA PROCESSING
        UpdateTextToSpeechData(state, action) {
            let tts_conversation_datas = [...state?.text_to_speech_data];
            let text_to_speech = state.text_to_speech;
            let disable_text_to_speech_typing = state.disable_text_to_speech_typing;

            if (action?.payload?.type === "request") {
                tts_conversation_datas.push({ from: 'me', _id: tts_conversation_datas?.length, original: text_to_speech }, { requested_for_audio: true })
                text_to_speech = ''
                disable_text_to_speech_typing = true
            }
            else if (action?.payload?.type === "response") {
                if (state.disable_text_to_speech_typing) {
                    tts_conversation_datas.pop()
                }
                tts_conversation_datas.push({ from: 'wss', _id: tts_conversation_datas?.length, ...action.payload?.data })
                disable_text_to_speech_typing = false
            }
            else {
                if (state.disable_text_to_speech_typing) {
                    tts_conversation_datas.pop()
                }
                disable_text_to_speech_typing = false
            }

            return {
                ...state,
                text_to_speech_data: tts_conversation_datas,
                text_to_speech,
                disable_text_to_speech_typing
            }
        },

        //TTS Audio playback
        updateAudioData(state, action) {
            return {
                ...state,
                audio_data: action.payload
            }
        },

        //Audio recorder
        updateRecorderData(state, action) {
            if (!action.payload?.modal_close_fun) {
                let recorder_modal = state.recorder_modal;
                let VisualizerData = state.VisualizerData;
                let is_recording = state.is_recording;
                let audio_url = action.payload?.type === "is_recording" ? null : state.audio_url;

                if (action.payload?.type === "modal_show") recorder_modal = !state.recorder_modal;
                if (action.payload?.type === "visualizer") VisualizerData = action.payload?.data || [];
                if (action.payload?.type === "is_recording") is_recording = action.payload?.data || false;
                if (action.payload?.type === "audio_url") audio_url = action.payload?.data || null;

                return {
                    ...state,
                    recorder_modal,
                    VisualizerData,
                    is_recording,
                    audio_url
                }
            } else {
                return {
                    ...state,
                    recorder_modal: false,
                    VisualizerData: [],
                    is_recording: false,
                    audio_url: null
                }
            }
        },
        updateIsRecording(state, action) {
            let stt_conversation_datas = [...state?.audio_to_text_messages];

            return {
                ...state,
                is_recording: action.payload,
                audio_to_text_messages: action.payload ? state?.audio_to_text_messages : stt_conversation_datas?.filter((value) => !value?.requested_for_message)
            }
        },

        //Audio to text messages
        updateAudioToTextMessages(state, action) {
            let stt_conversation_datas = [...state?.audio_to_text_messages];
            let is_highlighted = state.is_highlighted;

            if (action?.payload?.type === "request") {
                stt_conversation_datas.push({ requested_for_message: true });
            } else if (action?.payload?.type === "response") {
                if (![" .", " Thank you.", "Thanks.", " Thank You."].includes(action.payload?.data?.text ? action.payload.data.text : " .")) {
                    if (!stt_conversation_datas?.length) {
                        stt_conversation_datas = [{ from: 'wss', _id: 1, ...action.payload }, { requested_for_message: true }];
                    } else {
                        if (action.payload?.data?.type === "transcription") {
                            let updated = false;
                            stt_conversation_datas = stt_conversation_datas.map((item, index) => {
                                if (item?.type === "transcription") {
                                    updated = true;
                                    return {
                                        ...item,
                                        text: item.text + " " + action.payload?.data?.text
                                    };
                                }
                                return item;
                            });

                            if (!updated) {
                                stt_conversation_datas.push({
                                    from: 'wss',
                                    _id: stt_conversation_datas.length + 1,
                                    ...action.payload?.data
                                });
                            }
                        } else {
                            stt_conversation_datas.push({
                                from: 'wss',
                                _id: stt_conversation_datas.length + 1,
                                ...action.payload?.data
                            });
                        }
                    }

                    if (stt_conversation_datas[0]?.requested_for_message) stt_conversation_datas.reverse()
                }
            }

            // Checking for highlighted messages
            let check_highlighted = stt_conversation_datas?.filter((value) =>
                ["concise", "highlights"].includes(value?.type?.toLowerCase())
            );
            if (check_highlighted?.length) {
                is_highlighted = true;
            } else {
                is_highlighted = false;
            }

            return {
                ...state,
                audio_to_text_messages: stt_conversation_datas,
                is_highlighted
            };
        },


        updateTranscriptionsRequest(state, action) {
            return {
                ...state,
                transaction_loading: true,
                all_transcriptions: []
            }
        },
        updateTranscriptionsResponse(state, action) {
            return {
                ...state,
                transaction_loading: false,
                all_transcriptions: action.payload?.transcriptions?.reverse() || []
            }
        },
        updateTranscriptionsFailure(state, action) {
            return {
                ...state,
                transaction_loading: false,
            }
        },

        updateIndividualTranscriptionsRequest(state, action) {
            return {
                ...state,
                individual_transaction_loading: true,
                selected_transcriptions: []
            }
        },
        updateIndividualTranscriptionsResponse(state, action) {
            return {
                ...state,
                individual_transaction_loading: false,
                selected_transcriptions: action.payload?.transcription?.transcription ? [action.payload?.transcription?.transcription?.split("  ")?.join(" ")] : []
            }
        },
        updateIndividualTranscriptionsFailure(state, action) {
            return {
                ...state,
                individual_transaction_loading: false,
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout, (state, action) => {
                state.text_to_speech_data = []
                state.audio_to_text_messages = []
                state.selected_transcriptions = []
                state.all_transcriptions = []
            })
    }

})

const { actions, reducer } = MainSlice;

export const {
    update_font_page_details,
    updateTtsGender,
    updateTextToSpeech,
    UpdateTextToSpeechData,
    updateAudioData,
    updateRecorderData,
    updateIsRecording,
    updateAudioToTextMessages,

    updateTranscriptionsRequest,
    updateTranscriptionsResponse,
    updateTranscriptionsFailure,

    updateIndividualTranscriptionsRequest,
    updateIndividualTranscriptionsResponse,
    updateIndividualTranscriptionsFailure,
} = actions

export default reducer;



//     if (![" .", " Thank you.", "Thanks.", " Thank You."].includes(action.payload?.data?.text ? action.payload.data.text : " .")) {
//         stt_conversation_datas.pop()
//         stt_conversation_datas.push({ from: 'wss', _id: stt_conversation_datas?.length, ...action.payload?.data })

//         if (state.is_recording) {
//             stt_conversation_datas.push({ requested_for_message: true })
//         }
//     }