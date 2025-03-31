import { createSlice } from "@reduxjs/toolkit";
import Cookies from 'js-cookie'
import { decryptData, encryptData } from "Security/Crypto/Crypto";
import { updateIndividualTranscriptionsRequest, updateRecorderData, updateTranscriptionsFailure } from "Views/Main/Slice/MainSlice";

const commonSlice = createSlice({
    name: 'commonSlice',
    initialState: {
        modalShow: false,
        moalSize: "md",
        modal_from: null,
        modal_type: null,
        modal_close_btn: true,

        canvasShow: false,
        isOnline: true,
        currentNavMenuIndex: 0,
        currentMenuName: '',
        innerWidth: 0,
        innerHeight: 0,
        buttonSpinner: false,

        //login states
        usernamee: '',
        passwordd: '',
        eyeOpen: false,
        validated: false,

        //token
        token: Cookies.get("log_data") ? decryptData(Cookies.get("log_data"))?.access_token : '',
        user_id: Cookies.get("log_data") ? decryptData(Cookies.get("log_data"))?.user_id : '',
        email: Cookies.get("log_data") ? decryptData(Cookies.get("log_data"))?.email : '',
        user_role: Cookies.get("user_role") || '',

        //Register data
        register_user: {},

        //Languages
        languages: [],
        selected_language: sessionStorage.getItem('lang') ? decryptData(sessionStorage.getItem('lang')) : 'English'
    },
    reducers: {
        updateModalShow(state, actions) {
            return {
                ...state,
                modalShow: !state.modalShow
            }
        },
        updateCanvasShow(state, actions) {
            return {
                ...state,
                canvasShow: !state.canvasShow
            }
        },
        updateIsonline(state, action) {
            return {
                ...state,
                isOnline: action.payload
            }
        },
        updateCurrentNavMenuIndex(state, action) {
            return {
                ...state,
                currentMenuName: action.payload,
            }
        },
        updateScreenCurrentDimension(state, action) {
            return {
                ...state,
                innerWidth: action.payload?.innerWidth,
                innerHeight: action.payload?.innerHeight
            }
        },
        UpdateModalBox(state, action) {
            return {
                ...state,
                modalShow: true,
                moalSize: action.payload?.size,
                modal_from: action.payload?.modal_from,
                modal_type: action.payload?.modal_type,
                modal_close_btn: action.payload?.modal_close_btn,
            }
        },
        resetModalBox(state, action) {
            return {
                ...state,
                modalShow: false,
                moalSize: "md",
                modal_from: null,
                modal_type: null,
                modal_close_btn: true,
            }
        },
        resetUserCredentials(state, action) {
            return {
                ...state,
                usernamee: '',
                passwordd: ''
            }
        },

        //Toast
        updateToast(state, action) {
            return {
                ...state,
                Err: action.payload.message,
                Toast_Type: action.payload.type,
                buttonSpinner: false
            }
        },
        clearError(state, actions) {
            return {
                ...state,
                Err: null,
                Toast_Type: null
            }
        },

        //Form validation
        updateValidation(state, actions) {
            return {
                ...state,
                validated: true
            }
        },
        resetValidation(state, action) {
            return {
                ...state,
                validated: false
            }
        },

        //Login states
        updateLoginCredentials(state, action) {
            const type = Object.keys(action.payload)[0];
            switch (type) {
                case "username":
                    return {
                        ...state,
                        usernamee: action.payload?.username
                    }
                case "password":
                    return {
                        ...state,
                        passwordd: action.payload?.password
                    }
                default:
                    return
            }
        },
        updateEyeFunction(state, actions) {
            return {
                ...state,
                eyeOpen: !state.eyeOpen
            }
        },

        //Login and Register Api 
        userAuthRequest(state, actions) {
            return {
                ...state,
                buttonSpinner: true,
                token: null
            }
        },
        userAuthResponse(state, action) {
            if (action.payload?.access_token) {
                const encryptedToken = encryptData(action.payload)
                Cookies.set("log_data", encryptedToken)
            }
            return {
                ...state,
                buttonSpinner: false,
                eyeOpen: !state.eyeOpen,
                token: action.payload?.access_token,
                user_id: action.payload?.user_id,
                email: action.payload?.email,
                modalShow: true,
                moalSize: "xl",
                modal_from: "home",
                modal_type: "instructions",
                modal_close_btn: false,
            }
        },
        userAuthFailure(state, action) {
            return {
                ...state,
                Err: action.payload.message,
                Toast_Type: action.payload.type,
                buttonSpinner: false
            }
        },

        //Logout
        logout(state, actions) {
            Cookies.remove("log_data")

            return {
                ...state,
                token: null,
                user_id: null,
                email: null,
                usernamee: '',
                passwordd: '',
                register_user: {}
            }
        },

        //reset all menus
        updateResetAllMenus(state, action) {
            return {
                ...state,
                edited: false,
                validated: false,
                modalShow: false,
                pageSize: 10,
                currentPage: 1,
                entries_selected: false,
                search_value: '',
                search_clicked: false,
                apply_filter: false,
                apply_filter_clicked: false
            }
        },

        //Register data updating state
        updateRegisterEyeButtonOne(state, action) {
            return {
                ...state,
                registerEyeButtonOne: !state?.registerEyeButtonOne
            }
        },
        updateRegisterEyeButtonTwo(state, action) {
            return {
                ...state,
                registerEyeButtonTwo: !state?.registerEyeButtonTwo
            }
        },
        updateRegisterData(state, action) {
            return {
                ...state,
                register_user: {
                    ...state.register_user,
                    ...action.payload
                }
            }
        },

        //Get languages
        getLanguagesRequest(state, action) {
            return {
                ...state,
                languagesGlow: true
            }
        },
        getLanguagesResponse(state, action) {
            return {
                ...state,
                languagesGlow: false,
                languages: action.payload?.languages
            }
        },
        getLanguagesFailure(state, action) {
            return {
                ...state,
                languagesGlow: false,
                Err: action.payload?.message,
                Toast_Type: action.payload?.type
            }
        },

        updateSelectedLanguage(state, action) {
            if (action.payload) {
                sessionStorage.setItem('lang', encryptData(action.payload))
            }
            return {
                ...state,
                selected_language: action.payload
            }
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(updateRecorderData, (state, action) => {
                //Enable modal
                if (action.payload?.type === "modal_show" && !action.payload?.modal_close_fun) {
                    state.modalShow = true
                    state.moalSize = "md"
                    state.modal_from = "home"
                    state.modal_type = "recorder"
                }
                console.log(action.payload?.modal_close_fun)

                //Reset modal
                if (action.payload?.modal_close_fun) {
                    state.modalShow = false
                    state.moalSize = "md"
                    state.modal_from = null
                    state.modal_type = null
                }
            })
            .addCase(updateTranscriptionsFailure, (state, action) => {
                state.Err = action.payload?.type
                state.Toast_Type = action.payload?.type
            })
            .addCase(updateIndividualTranscriptionsRequest, (state, action) => {
                state.modalShow = true
                state.modal_close_btn = true
                state.moalSize = "lg"
                state.modal_from = "transcription"
                state.modal_type = "individual"
            })
    }
})

const { actions, reducer } = commonSlice;

export const {
    updateModalShow,
    updateCanvasShow,
    updateIsonline,
    updateCurrentNavMenuIndex,
    updateScreenCurrentDimension,
    updateLoginCredentials,
    updateEyeFunction,
    clearError,
    updateResetAllMenus,
    resetModalBox,

    resetValidation,
    updateValidation,

    userAuthRequest,
    userAuthResponse,
    userAuthFailure,

    updateToast,
    logout,

    updateRegisterEyeButtonOne,
    updateRegisterEyeButtonTwo,
    updateRegisterData,

    getLanguagesRequest,
    getLanguagesResponse,
    getLanguagesFailure,
    updateSelectedLanguage,
    UpdateModalBox,
    resetUserCredentials
} = actions;

export default reducer