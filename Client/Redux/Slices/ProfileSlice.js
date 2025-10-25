import axiosInstance from "../../src/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    data: null
}

// function to fetch the profile from backend
export const fetchUserProfile = createAsyncThunk("/profile/user-profile", async(user_id) => {
    try{
        const resPromise = axiosInstance.get(`/user/${user_id}`);
        const res = await toast.promise(resPromise, {
            loading: "Loading User Profile...",
            success: "User Profile Loaded",
            error: "OOPS! Failed to load User Profile"
        });

        return res.data;
    } catch(error){
        toast.error(error?.response?.data?.message);
    }
});

//function to edit user profile
export const editUserProfile = createAsyncThunk("/profile/edit-profile", async(data) => {
    try{
      const resPromise = axiosInstance.put("/user/updateProfile", data);
      const res = await toast.promise(resPromise, {
        loading: "Updating user profile",
        success: "Profile Updated",
        error: "Failed to update profile"
      })

      return res.data;
    } catch(error){
        toast.error(error?.response?.data?.message);
    }
});

// function to generate bio using AI
export const generateBioWithAI = createAsyncThunk("/profile/generate-bio", async(data) => {
    try{
      const resPromise = axiosInstance.post("/user/generate-ai-bio", data);
      const res = await toast.promise(resPromise, {
        loading: "Generating Bio",
        success: "Bio Generated",
        error: "Failed to generate Bio"
      });

      return res.data;

    } catch(error){
        toast.error(error?.response?.data?.message);
    }
})

//extra reducers
const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: ((builder) => {
        builder
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.data = action?.payload?.user
        })
        .addCase(generateBioWithAI.fulfilled, (state, action) => {
            state.generatedBio = action?.payload?.bio
        })
    })
})

export default profileSlice.reducer;