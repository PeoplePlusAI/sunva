import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { thunk } from "redux-thunk"
import commonReducer from 'Views/Common/Slice/Common_slice';
import mainReducer from 'Views/Main/Slice/MainSlice';


const reducers = combineReducers({
    commonState: commonReducer,
    mainState: mainReducer
})

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(thunk),
    devTools: true
})

export default store;