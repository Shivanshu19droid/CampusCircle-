import axiosInstance from "../../src/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { likeUnlikePost } from "./postSlice";

const initialState = {
    data: null,
    userPosts: [],
    hasMorePosts: false,
    page: 1,
    limit: 10,
    postsCount: 0,
    isLoading: false,
    loadingMorePosts: false

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

// fetch paginated posts from backend
export const fetchPaginatedUserPosts = createAsyncThunk("/user/posts", async({id, page}) => {
    try {
      const resPromise = axiosInstance.get(`/user/${id}/posts`, {params: {page}} );
      const res = await toast.promise(resPromise, {
        loading: "Loading User Posts...",
        success: "User Posts Loaded",
        error: "OOPS! Failed to load User Posts"
      });

      return res.data;

    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

// like-unlike post

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
});

//follow a user
export const followUser = createAsyncThunk("/profile/follow-user", async(id) => {
    try {
      const resPromise = axiosInstance.put(`/user/follow/${id}`);
      const res = await toast.promise(resPromise, {
        loading: "Fulfilling your request...",
        success: (res) => {
            return res?.data?.message; 
        },
        error: "Request failed!"
      })

      return res.data;

    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

//unfollow a user
export const unfollowUser = createAsyncThunk("/prfile/unfollow-user", async(id) => {
    try {
      const resPromise = axiosInstance.put(`/user/unfollow/${id}`);
      const res = await toast.promise(resPromise, {
        loading: "Fulfilling your request...",
        success: (res) => {
            return res?.data?.message;
        },
        error: "Request failed!"
      })

      return res.data;
      
    } catch(error) {
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
        .addCase(fetchUserProfile.pending, (state) => {
            state.isLoading = true;
            state.data = null;
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.data = action?.payload?.user
        })
        .addCase(generateBioWithAI.fulfilled, (state, action) => {
            state.generatedBio = action?.payload?.bio
        })
        .addCase(fetchPaginatedUserPosts.pending, (state, action) => {
            if(action?.meta?.arg?.page === 1) {
                state.isLoading = true;
                state.userPosts = [];
            }
            else {
                state.loadingMorePosts = true;
            }
        })
        .addCase(fetchPaginatedUserPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.loadingMorePosts = false;
            
            const {posts, hasMorePosts, page, limit, postsCount} = action?.payload;

            if(action?.meta?.arg?.page === 1) {
                state.userPosts = [...posts];
            }
            else {
                state.userPosts = [...state.userPosts, ...posts];
            }
            state.page = page;
            state.hasMorePosts = hasMorePosts;
            state.postsCount = postsCount;
        })
        .addCase(fetchPaginatedUserPosts.rejected, (state) => {
            state.isLoading = false;
            state.loadingMorePosts = false;
        })
        .addCase(likeUnlikePost.fulfilled, (state, action) => {
            const updatedPost = action?.payload?.post;
            state.userPosts = state.userPosts.map(post => post._id === updatedPost._id ? updatedPost : post);
        })
    })
})

export default profileSlice.reducer;