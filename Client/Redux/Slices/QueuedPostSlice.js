import axiosInstance from "../../src/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    queuedPosts: [],
    isLoading: false,
    queuedPostsPage: 1,
    queuedPostsCount: 0,
    loadingMoreQueuedPosts: false,
    groupDetails: null
}

//reducer to fetch all the queued posts from backend
export const fetchPaginatedQueuedPosts = createAsyncThunk("/group/fetch-queued-posts", async({groupId, page}) => {
    try {
      const resPromise = axiosInstance.get(`/group/${groupId}/queued-posts`, {params: {page}});
      const res = await toast.promise(resPromise, {
        loading: "Loading queued posts...",
        success: (res) => {
            return res?.data?.message;
        },
        error: "Failed to load queued posts"
      });
      return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

//reducer to approve a queued post
export const approveQueuedPost = createAsyncThunk("/group/approve-queued-post", async({ postId }) => {
    try {
      const resPromise = axiosInstance.post(`/post/approve/${postId}`);
      const res = await toast.promise(resPromise, {
        loading: "Approving post...",
        success: (res) => {
            return res?.data?.message;
        },
        error: "Failed to approve post"
      });
      return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

export const rejectQueuedPost = createAsyncThunk("/group/reject-queued-post", async({postId}) => {
    try {
      const resPromise = axiosInstance.post(`/post/reject/${postId}`);
      const res = await toast.promise(resPromise, {
        loading: "Rejecting post ...",
        success: (res) => {
            return res?.data?.message;
        },
        error: "Failed to reject post"
      });
      return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

const queuedPostSlice = createSlice({
    name: "queuedPosts",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPaginatedQueuedPosts.pending, (state, action) => {
             const reqPage = action?.meta?.arg?.page || action?.payload?.queuedPostPage;
             if(reqPage === 1) {
                state.queuedPosts = [];
                state.isLoading = true;
                state.loadingMoreQueuedPosts = false;
             }
             else {
                state.loadingMoreQueuedPosts = true;
             }
        })
        .addCase(fetchPaginatedQueuedPosts.fulfilled, (state, action) => {
            const {queuedPosts, hasMoreQueuedPosts, page, queuedPostsCount, groupDetails} = action?.payload;
            if(page === 1) {
                state.queuedPosts = [...queuedPosts];
            } else {
                state.queuedPosts = [...state.queuedPosts, ...queuedPosts];
            }
            state.queuedPostsPage = page;
            state.queuedPostsCount = queuedPostsCount;
            state.isLoading = false;
            state.loadingMoreQueuedPosts = false;
            state.hasMoreQueuedPosts = hasMoreQueuedPosts;
            state.groupDetails = groupDetails;
        })
        .addCase(fetchPaginatedQueuedPosts.rejected, (state) => {
            state.isLoading = false;
            state.loadingMoreQueuedPosts = false;
        })
        .addCase(approveQueuedPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(approveQueuedPost.fulfilled, (state, action) => {
            const {approvedPost} = action?.payload;
            state.queuedPosts = state.queuedPosts.filter(post => post._id !== approvedPost._id);
            state.queuedPostsCount--;
            state.isLoading = false;
        })
        .addCase(approveQueuedPost.rejected, (state) => {
            state.isLoading = false;
        })
        .addCase(rejectQueuedPost.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(rejectQueuedPost.fulfilled, (state, action) => {
            const {rejectedPost} = action?.payload;
            state.queuedPosts = state.queuedPosts.filter(post => post._id !== rejectedPost._id);
            state.queuedPostsCount--;
            state.isLoading = false;
        })
        .addCase(rejectQueuedPost.rejected, (state) => {
            state.isLoading = false;
        })

    }
});

export default queuedPostSlice.reducer;