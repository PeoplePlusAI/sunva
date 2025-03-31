import ISO6391 from "iso-639-1";
import Icons from './Icons';
import useCommonState, { useCustomNavigate, useDispatch } from 'ResuableFunctions/CustomHooks';
import { handleRegisterOnChange } from 'Views/Common/Action/Common_action';
import { updateRegisterEyeButtonOne, updateRegisterEyeButtonTwo, updateSelectedLanguage } from 'Views/Common/Slice/Common_slice';
import useTTS, { handle_font_data_onchange } from 'Views/Main/Action/MainAction';
import { updateTextToSpeech, updateTtsGender } from "Views/Main/Slice/MainSlice";
import useSunvaAI from "Views/Main/Action/useSunvaAi";

export const validateEmail = email => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const languageMap = code => {
    return ISO6391.getName(code)
};

export const languageCodeFinder = language => {
    return ISO6391.getCode(language)
};

const JsonData = () => {
    //main selectors
    const dispatch = useDispatch();
    const navigate = useCustomNavigate();
    const { commonState, mainState } = useCommonState();
    const { sendText } = useTTS(commonState?.user_id, languageCodeFinder(commonState?.selected_language), mainState?.text_to_speech_gender?.toLowerCase(), () => console.log("Sending message..."))
    const {
        startRecording,
        stopRecording
    } = useSunvaAI({ user_id: commonState?.user_id, lang: languageCodeFinder(commonState?.selected_language) });

    const jsonOnly = {
        sidebarMenus: [
            {
                icon: Icons?.sideBar_menu_one,
                route: "/dashboard/home"
            },
            {
                icon: Icons?.sideBar_menu_two,
                route: "/dashboard/conversation"
            },
            {
                icon: Icons?.sideBar_menu_three,
                route: "/dashboard/new"
            },
            {
                icon: Icons?.sideBar_menu_four,
                route: "/dashboard/settings"
            },
        ],
        gender: [
            "Male",
            "Female"
        ],
        navigation_menubar: [
            {
                icon: Icons?.sideBar_menu_one,
                click: () => navigate('/dashboard/settings'),
                active: commonState?.currentMenuName === "settings",
                title: "settings"
            },
            {
                icon: commonState?.currentMenuName === "home" ?
                    mainState?.is_recording ?
                        Icons?.sideBar_menu_three_mike_active
                        :
                        Icons?.sideBar_menu_three_active
                    :
                    Icons?.sideBar_menu_three,
                touchStart: commonState?.currentMenuName === "home" ?
                    mainState?.is_recording ?
                        stopRecording
                        :
                        startRecording
                    :
                    () => navigate('/dashboard/home'),
                mouseDown: commonState?.currentMenuName === "home" ?
                    mainState?.is_recording ?
                        stopRecording
                        :
                        startRecording
                    :
                    () => navigate('/dashboard/home'),
                active: commonState?.currentMenuName === "home",
                title: "home"
            },
            {
                icon: Icons?.sideBar_menu_four,
                click: () => navigate('/dashboard/transcription'),
                active: commonState?.currentMenuName === "transcription",
                title: "transcription"
            },
            {
                icon: Icons?.sideBar_menu_five,
                click: () => navigate('/dashboard/conversation'),
                active: commonState?.currentMenuName === "conversation",
                title: "conversation"
            },
        ]
    }

    const jsxJson = {
        register_inputs: [
            {
                placeholder: "Email",
                type: "email",
                category: "input",
                className: 'col-12 input_padding_new mt-2',
                value: commonState?.register_user?.email || '',
                change: (e) => dispatch(handleRegisterOnChange({ email: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated ?
                    commonState?.register_user?.email ?
                        !validateEmail(commonState.register_user.email) ?
                            "Invalid Email"
                            :
                            null
                        :
                        "Email required"
                    :
                    null
            },
            {
                category: "input",
                type: "password",
                placeholder: "Password",
                className: 'col-12 input_padding_new mt-2',
                value: commonState?.register_user?.password || '',
                change: (e) => dispatch(handleRegisterOnChange({ password: e.target.value })),
                eyeState: !commonState?.registerEyeButtonOne,
                eyeFunctionClick: () => dispatch(updateRegisterEyeButtonOne()),
                isMandatory: true,
                Err: commonState?.validated && !commonState?.register_user?.password ? "Password required" : null
            },
            {
                placeholder: "Confirm Password",
                type: "password",
                category: "input",
                className: 'col-12 input_padding_new mt-2',
                value: commonState?.register_user?.confirm_password || '',
                change: (e) => dispatch(handleRegisterOnChange({ confirm_password: e.target.value })),
                eyeState: !commonState?.registerEyeButtonTwo,
                eyeFunctionClick: () => dispatch(updateRegisterEyeButtonTwo()),
                isMandatory: true,
                Err: commonState?.validated ?
                    commonState?.register_user?.confirm_password ?
                        commonState?.register_user?.password === commonState?.register_user?.confirm_password ?
                            null
                            :
                            "Password and Confirm password incorrect"
                        :
                        "Confirm password required"
                    :
                    null
            },
        ],
        select_language_array: [
            {
                type: "normal_select",
                category: "select",
                className: commonState?.innerWidth > 575 ? "" : "border-0",
                options: commonState?.languages?.length ? commonState?.languages?.map((codes) => languageMap(codes)) : ['English'],
                divClassName: 'col-12 p-1',
                value: commonState?.selected_language,
                default_select_option: false,
                change: (e) => dispatch(updateSelectedLanguage(e.target.value)),
                disabled: mainState?.is_recording
            },
        ],
        select_font_details: [
            {
                type: "textbox",
                category: "textbox",
                placeholder: "Test your test size here",
                value: mainState?.font_page_details?.input_text || '',
                divClassName: 'col-12 p-1 mt-2',
                controlClassName: 'resize_none',
                rows: 3,
                change: (e) => dispatch(handle_font_data_onchange({ input_text: e.target.value })),
                style: {
                    fontSize: mainState?.font_page_details?.font_size + 'px',
                    fontWeight: mainState?.font_page_details?.font_weight * 100
                },
                isMandatory: false
            },
            {
                name: "Font Size",
                type: "range",
                category: "input",
                className: 'col-12 p-1 mt-2',
                value: mainState?.font_page_details?.font_size || 16,
                change: (e) => dispatch(handle_font_data_onchange({ font_size: e.target.value })),
                is_min_value: 8,
                is_max_value: 30,
                isMandatory: true,
                Err: commonState?.validated && !mainState?.font_page_details?.font_size ? "Font size required" : null
            },
            {
                name: "Font Weight",
                type: "range",
                category: "input",
                className: 'col-12 p-1 mt-2',
                value: mainState?.font_page_details?.font_weight || 0,
                change: (e) => dispatch(handle_font_data_onchange({ font_weight: e.target.value })),
                is_min_value: 1,
                is_max_value: 10,
                isMandatory: true,
                Err: commonState?.validated && !mainState?.font_page_details?.font_weight ? "font weight required" : null
            },
        ],
        select_gender_array: [
            {
                name: "",
                type: "normal_select",
                category: "select",
                options: jsonOnly?.gender,
                divClassName: 'col-12 p-1 mt-2',
                value: mainState?.text_to_speech_gender,
                default_select_option: false,
                change: (e) => dispatch(updateTtsGender(e.target.value)),
                disabled: mainState?.disable_text_to_speech_typing
            },
        ],
        text_to_speech_input: [
            {
                placeholder: "Type a message...",
                type: "text",
                category: "input",
                className: 'form-control w-100 py-3 rounded-3 text_to_speech',
                value: mainState?.text_to_speech || '',
                change: (e) => dispatch(updateTextToSpeech(e.target.value)),
                keyDown: (e) => {
                    if (e.key === "Enter") {
                        sendText()
                    }
                },
                disabled: mainState?.disable_text_to_speech_typing
            },
        ]
    }

    return {
        "jsonOnly": jsonOnly,
        "jsxJson": jsxJson
    }
}

export default JsonData