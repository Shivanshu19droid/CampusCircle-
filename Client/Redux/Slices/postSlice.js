import axiosInstance from "../../src/Helpers/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

//defining the initial state
const initialState = {
    posts: [],
    singlePost: null,
    isLoading: false,
    loadingMorePosts: false,
    page: 1,
    hasMorePosts: true, 
    moreCommentsLoading: false,
    hasMoreComments: true,
    commentsPage: 1,
    comments: []
}


//creating a new post action
export const createPost = createAsyncThunk("/posts/create-new", async(data) => {
    try {
     const resPromise = axiosInstance.post("/post/create", data);
     const res = await toast.promise(resPromise, {
        loading: "Creating new Post",
        success:  (res) => {
            return res?.data?.message;
        }
     });
     return res.data;
   } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

//like-unlike post action
export const likeUnlikePost = createAsyncThunk("/posts/like-unlike-post", async(postId) => {
    try {
      const res = await axiosInstance.put(`/post/like-unlike/${postId}`);
    //   const res = await toast.promise(resPromise, {
    //     loading: "Updating like status",
    //     success: (res) => {
    //         return res?.data?.message;
    //     },
    //     error: "Failed to update like status"
    //   });
      return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

//comment on post action
export const commentOnPost = createAsyncThunk("/posts/comment-on-post", async({postId, content}) => {
    try {
      const resPromise = axiosInstance.post(`/post/comment/${postId}`, {content});
      const res = await toast.promise(resPromise, {
        loading: "Adding your comment...",
        success: (res) => {
            return res?.data?.message;
        },
        error: "Failed to add comment"
    });
    return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

//approve a post by member action (accessible to group admin only)
export const approvePost = createAsyncThunk("/posts/approve-post-by-member", async(postId) => {
    try {
      const resPromise = axiosInstance.post(`/post/approve/${postId}`);
      const res = await toast.promise(resPromise, {
        loading: "Approving post...",
        success: (res) => {
            return res?.data?.message;        }
      });
      return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
} );

//rejecting a post by member action (accessible to group admin only)
export const rejectPost = createAsyncThunk("/posts/reject-post-by-member", async(postId) => {
    try {
      const resPromise = axiosInstance.post(`/post/reject/${postId}`);
      const res = await toast.promise(resPromise, {
        loading: "Rejecting post...",
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

//action to get all posts
export const fetchAllPosts = createAsyncThunk("/posts/fetch-all-posts", async({page}) => {
    try {
      const resPromise = axiosInstance.get(`/post/all-posts/?page=${page}`);
      const res = await toast.promise(resPromise, {
        loading: "Loading the posts...", 
        success: (res) => {
            return res?.data?.message;
        },
        error: "Failed to load the posts"
      });
      return {...res.data, page};
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

//action to get a single post
export const fetchSinglePost = createAsyncThunk("/posts/fetch-single-post", async({postId, page}) => {
    try {
      const resPromise = axiosInstance.get(`/post/${postId}?page=${page}`);
      const res = await toast.promise(resPromise, {
        loading: "Loading post details...",
        success: (res) => {
            return res?.data?.message;
        },
        error: "Failed to load post"
      });
      return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

//action to get paginated comments
export const fetchPaginatedComments = createAsyncThunk("/posts/fetch-paginated-commnets", async({postId, page}) => {
    try {
      const res = await axiosInstance.get(`/post/${postId}/comments?page=${page}`);
      return {
        comments: res?.data?.comments,
        hasMore: res?.data?.hasMore,
        page
      }
    } catch(error) {
        toast.error("Failed to load comments");
    }
})

//delete comment action
export const deleteComment = createAsyncThunk("/posts/delete-comment", async({postId, commentId}) => {
    try {
      const resPromise = axiosInstance.delete(`/post/${postId}/delete-comment/${commentId}`);
      const res = await toast.promise(resPromise, {
        loading: "Deleting comment...",
        success: "Comment deleted",
        error: "Failed to delete comment"
      });
      return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
})

//action to delete a post
export const deletePost = createAsyncThunk("/posts/delete-post", async(postId) => {
    try {
      const resPromise = axiosInstance.post(`/post/delete/${postId}`);
      const res = await toast.promise(resPromise, {
        loading: "Deleting post...",
        success: (res) => {
            return res?.data?.message;
        },
        error: "Failed to delete post"
      });
      return res.data;
    } catch(error) {
        toast.error(error?.response?.data?.message);
    }
});

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPosts.pending, (state, action) => {
                const reqPage = action?.meta?.arg?.page;
                if(reqPage === 1) {
                    state.isLoading = true; // main loading
                    state.loadingMorePosts = false;
                } else {
                    state.loadingMorePosts = true;
                }
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                const {posts, page, hasMore} = action?.payload;
                if(page === 1) {
                    state.posts = [...posts];
                } else {
                    state.posts = [...state.posts, ...posts];
                }

                state.isLoading = false;
                state.loadingMorePosts = false;
                state.page = page;
                state.hasMorePosts = hasMore;
            })
            .addCase(fetchAllPosts.rejected, (state) => {
                state.isLoading = false;
                state.loadingMorePosts = false;
            })
            .addCase(fetchSinglePost.pending, (state) => {
                state.isLoading = true;
                state.singlePost = null;
            })
            .addCase(fetchSinglePost.fulfilled, (state, action) => {
                state.singlePost = action?.payload?.post;
                state.isLoading = false;
            })
            .addCase(fetchSinglePost.rejected, (state) => {
                state.isLoading = false;
                state.singlePost = null;
            })

            .addCase(likeUnlikePost.fulfilled, (state, action) => {
                const updatedPost = action?.payload?.post;

                // update the liked/unliked post in the redux store
                state.posts = state.posts.map(post => post._id === updatedPost._id ? updatedPost: post);

                //also update if the user it viewing it from single post
                if(state.singlePost?._id === updatedPost._id) {
                    state.singlePost = updatedPost;
                }
            })
            .addCase(fetchPaginatedComments.pending, (state) => {
                state.moreCommentsLoading = true;
            })
            .addCase(fetchPaginatedComments.fulfilled, (state, action) => {
                const {comments, hasMore, page} = action?.payload;
                if(page === 1) {
                    state.comments = [...comments];
                } else {
                    state.comments = [...state.comments, ...comments];
                }

                state.hasMoreComments = hasMore;
                state.commentsPage = page;
                state.moreCommentsLoading = false;
            })
            .addCase(fetchPaginatedComments.rejected, (state) => {
                state.moreCommentsLoading = false;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const deletedCommentId = action?.payload?.deletedComment._id;
                if(!deletedCommentId) return;
                state.comments = state.comments.filter(comment => comment._id !== deletedCommentId);
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                const deletedPost = action?.payload?.deletedPost;

                state.posts = state.posts.filter(post => post._id !== deletedPost._id);
            })
    }
});

export default postSlice.reducer;
