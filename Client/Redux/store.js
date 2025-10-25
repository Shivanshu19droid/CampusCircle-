import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Redux/Slices/AuthSlice";
import profileReducer from "../Redux/Slices/ProfileSlice";




const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer
    }
});

export default store;