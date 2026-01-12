import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/Slices/AuthSlice";
import profileReducer from "../Redux/Slices/ProfileSlice";
import groupReducer from "../Redux/Slices/GroupSlice";
import postReducer from "../Redux/Slices/postSlice";




const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        group: groupReducer,
        post: postReducer
    }
});

export default store;