import axiosInstance from 'Services/axiosInstance';
import {
    updateModalShow,
    updateCanvasShow,
    updateLoginCredentials,
    updateEyeFunction,

    clearError,
    resetValidation,
    updateValidation,

    userAuthRequest,
    userAuthResponse,
    logout,

    updateResetAllMenus,
    userAuthFailure,

    updateRegisterData,

    getLanguagesRequest,
    getLanguagesResponse,
    getLanguagesFailure,
} from 'Views/Common/Slice/Common_slice';

export const handleUpdateModalShow = (dispatch) => {
    dispatch(updateModalShow())
}

export const handleUpdateCanvasShow = (dispatch) => {
    dispatch(updateCanvasShow())
}

export const handleLoginCredentials = (data) => (dispatch) => {
    dispatch(updateLoginCredentials(data))
}

export const handleEyeFunction = () => dispatch => {
    dispatch(updateEyeFunction())
}

export const handleClearErrors = dispatch => {
    dispatch(clearError())
}

export const handleValidation = dispatch => {
    dispatch(updateValidation())
}

export const handleResetValidation = dispatch => {
    dispatch(resetValidation())
}

//reset all 
export const handleResetAlMenus = dispatch => {
    dispatch(updateResetAllMenus())
}

//login api 
export const handleLogin = (params, navigate) => async (dispatch) => {
    try {
        dispatch(userAuthRequest())
        const res = await axiosInstance.post('/user/login', params);
        if (res.status === 200) {
            dispatch(userAuthResponse(res?.data))
            navigate('/dashboard/home')
        } else {
            dispatch(userAuthFailure({ message: res?.data?.message, type: "error" }))
        }
    } catch (err) {
        dispatch(userAuthFailure({ message: err?.response?.data?.detail, type: "error" }))
    }
}

//Logout api
export const handleLogout = (navigate) => async (dispatch) => {
    dispatch(logout())
    return

    try {
        const res = await axiosInstance.post('/user/logout');
        if (res.status === 200)
            dispatch(logout())
        else
            dispatch(userAuthFailure({ message: res?.data?.message, type: "error" }))
    } catch (err) {
        dispatch(userAuthFailure({ message: err?.response?.data?.detail, type: "error" }))
    }
}

//Regsiter onchange function
export const handleRegisterOnChange = (params) => dispatch => {
    dispatch(updateRegisterData(params))
}

//Regsiter api 
export const handleRegistration = (params, navigate) => async (dispatch) => {
    try {
        dispatch(userAuthRequest())
        const res = await axiosInstance.post('/user/register', params);
        if (res.status === 200) {
            dispatch(userAuthResponse(res?.data))
            navigate('/dashboard/home')
        } else {
            dispatch(userAuthFailure({ message: res?.data?.message, type: "error" }))
        }
    } catch (err) {
        dispatch(userAuthFailure({ message: err?.response?.data?.detail, type: "error" }))
    }
}

//Get languages endpoint
export const handleGetAllLanguages = () => async (dispatch) => {
    try {
        dispatch(getLanguagesRequest())
        const res = await axiosInstance.get('/v1/languages');
        if (res.status === 200) {
            dispatch(getLanguagesResponse(res?.data))
        } else {
            dispatch(getLanguagesFailure({ message: res?.data?.message, type: "error" }))
        }
    } catch (err) {
        dispatch(getLanguagesFailure({ message: err?.response?.data?.detail, type: "error" }))
    }
}