import axiosInstance from "../../src/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  groups: [],
  posts: [],
  members: [],
  admins: [],
  isLoading: false,
  singleGroup: null,
  postPage: 1,
  membersPage: 1,
  adminsPage: 1,
  loadingMoreGroups: false,
  hasMoreGroups: true,
  loadingMorePosts: false,
  loadingMoreMembers: false,
  hasMorePosts: true,
  hasMoreMembers: true,
  hasMoreAdmins: true,
  loadingMoreAdmins: false,
  postsCount: 0,
};

//creating a new group action
export const createNewGroup = createAsyncThunk(
  "/group/create",
  async (data) => {
    try {
      const resPromise = axiosInstance.post("/group/create", data);
      const res = await toast.promise(resPromise, {
        loading: "Creating new group...",
        success: "Your group has been created",
        error: "Failed to create group",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

//joining a group action
export const joinGroup = createAsyncThunk("/group/join", async (groupId) => {
  try {
    const resPromise = axiosInstance.post(`/group/join/${groupId}`);
    const res = await toast.promise(resPromise, {
      loading: "Joining the group...",
      success: (res) => {
        return res?.data?.message;
      },
      error: "Failed to join group",
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

//leaving a group action
export const leaveGroup = createAsyncThunk("/group/leave", async (groupId) => {
  try {
    const resPromise = axiosInstance.post(`/group/leave/${groupId}`);
    const res = await toast.promise(resPromise, {
      loading: "Leaving the group...",
      success: (res) => {
        return res?.data?.message;
      },
      error: "Failed to leave group",
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

//getting all groups action
export const getAllGroups = createAsyncThunk(
  "/group/all-groups",
  async ({ page, searchQuery }) => {
    try {
      const resPromise = axiosInstance.get("/group", {
        params: { page, searchQuery },
      });
      const res = await toast.promise(resPromise, {
        loading: "Fetching all groups...",
        success: "Groups fetched successfully",
        error: "Failed to fetch groups",
      });
      return { ...res.data, page };
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

//getting a single group action
export const getSingleGroup = createAsyncThunk(
  "/group/single-group",
  async (groupId) => {
    try {
      const resPromise = axiosInstance.get(`/group/${groupId}`);
      const res = await toast.promise(resPromise, {
        loading: "Fetching group details...",
        success: "Group details fetched successfully",
        error: "Failed to fetch group details",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

//delete a group action
export const deleteGroup = createAsyncThunk(
  "/group/delete",
  async (groupId) => {
    try {
      const resPromise = axiosInstance.delete(`/group/${groupId}`);
      const res = await toast.promise(resPromise, {
        loading: "Deleting group...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to delete group",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

//fetching paginated members of a group action
export const fetchPaginatedGroupMembers = createAsyncThunk(
  "/group/members",
  async ({ groupId, page, flag }) => {
    try {
      const res = await axiosInstance.get(`/group/${groupId}/members`, {
        params: { page, flag },
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

//fetching paginated posts of a group action
export const fetchPaginatedGroupPosts = createAsyncThunk(
  "/group/posts",
  async ({ groupId, page }) => {
    try {
      const res = await axiosInstance.get(`/group/${groupId}/posts`, {
        params: { page },
      });
      return {
        posts: res.data?.posts,
        hasMore: res.data?.hasMorePosts,
        page: res.data?.page,
        postCount: res.data?.postsCount,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

//action to remove a member from group
export const removeFromGroup = createAsyncThunk(
  "/group/remove-member",
  async ({ groupId, memberId }) => {
    try {
      const resPromise = axiosInstance.delete(
        `/group/${groupId}/remove-member/${memberId}`
      );
      const res = await toast.promise(resPromise, {
        loading: "Removing user from group...",
        success: "User removed from group",
        error: "Failed to remove member from gorup",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

//action to make an admin in a group
export const makeGroupAdmin = createAsyncThunk(
  "/group/make-admin",
  async ({ groupId, memberId }) => {
    try {
      const resPromise = axiosInstance.post(
        `/group/${groupId}/make-admin/${memberId}`
      );
      const res = await toast.promise(resPromise, {
        loading: "Making group admin...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to make group admin",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// remove from admin action
export const removeFromAdmin = createAsyncThunk(
  "/group/remove-admin",
  async ({ groupId, memberId }, {rejectWithValue}) => {
    try {
      const resPromise = axiosInstance.delete(
        `/group/${groupId}/remove-admin/${memberId}`
      );
      const res = await toast.promise(resPromise, {
        loading: "Removing user from admins...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to remove member from admins",
      });
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message;
      return rejectWithValue(message);
    }
  }
);

// like or unlike post action
export const likeUnlikePost = createAsyncThunk(
  "/group/like-unlike-post",
  async (postId) => {
    try {
      const resPromise = axiosInstance.put(`/post/like-unlike/${postId}`);
      const res = await toast.promise(resPromise, {
        loading: "Updating like status",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to update like status",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const deleteGroupPost = createAsyncThunk(
  "/group/delete-post",
  async (postId) => {
    try {
      const resPromise = axiosInstance.post(`/post/delete/${postId}`);
      const res = await toast.promise(resPromise, {
        loading: "Deleting post...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to delete post",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

//thunk to edit the group
export const editGroup = createAsyncThunk("/group/edit", async({data, groupId}) => {
  try {
    const resPromise = axiosInstance.put(`/group/${groupId}/edit`, data);
    const res = await toast.promise(resPromise, {
      loading: "Updating group details...",
      success: "Group details updated!",
      error: "Failed to upload group details"
    });
    return res.data;
  } catch(error) {
    toast.error(error?.response?.data?.message);
  }
});

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroups.pending, (state, action) => {
        const reqPage = action.meta.arg.page;
        if (reqPage === 1) {
          state.isLoading = true; // main loading
          state.loadingMoreGroups = false;
        } else {
          state.loadingMoreGroups = true;
        }
      })
      .addCase(getAllGroups.fulfilled, (state, action) => {
        const { groups, page, hasMore } = action?.payload;
        if (page === 1) {
          state.groups = [...groups];
        } else {
          state.groups = [...state.groups, ...groups];
        }

        state.hasMoreGroups = hasMore;
        state.page = page;
        state.isLoading = false;
        state.loadingMoreGroups = false;
      })
      .addCase(getAllGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.loadingMoreGroups = false;
      })
      .addCase(getSingleGroup.pending, (state) => {
        state.isLoading = true;
        state.singleGroup = null;

        // Clear previous group's lists when loading a new group
        state.posts = [];
        state.members = [];
        state.admins = [];
        state.postPage = 1;
        state.membersPage = 1;
        state.adminsPage = 1;
        state.hasMorePosts = true;
        state.hasMoreMembers = true;
        state.hasMoreAdmins = true;
      })
      .addCase(getSingleGroup.fulfilled, (state, action) => {
        state.singleGroup = action?.payload?.group;
        state.admins = action?.payload?.group?.admins;
        state.isLoading = false;
      })
      .addCase(getSingleGroup.rejected, (state) => {
        state.isLoading = false;
        state.singleGroup = null;
      })
      .addCase(fetchPaginatedGroupMembers.pending, (state, action) => {
        const { flag } = action?.meta?.arg;

        if (flag === "members") {
          state.loadingMoreMembers = true;
        } else if (flag === "admins") {
          //state.loadingMoreAdmins = true;
        }
      })
      .addCase(fetchPaginatedGroupMembers.fulfilled, (state, action) => {
        const { flagItem } = action?.payload;
        // if (flagItem === "admins") {
        //   const { admins, hasMoreAdmins, adminPage } = action?.payload;
        //   if (adminPage === 1) {
        //     state.admins = [...admins];
        //   } else {
        //     state.admins = [...state.admins, ...admins];
        //   }
        //   state.hasMoreAdmins = hasMoreAdmins;
        //   state.adminsPage = adminPage;
        //   state.loadingMoreAdmins = false;
        // } else 
          if (flagItem === "members") {
          const { members, hasMoreMembers, memberPage } = action?.payload;
          if (memberPage === 1) {
            state.members = [...members];
          } else {
            state.members = [...state.members, ...members];
          }
          state.hasMoreMembers = hasMoreMembers;
          state.membersPage = memberPage;
          state.loadingMoreMembers = false;
        }
      })
      .addCase(fetchPaginatedGroupMembers.rejected, (state) => {
        state.loadingMoreMembers = false;
        state.loadingMoreAdmins = false;
      })
      .addCase(fetchPaginatedGroupPosts.pending, (state) => {
        state.loadingMorePosts = true;
      })
      .addCase(fetchPaginatedGroupPosts.fulfilled, (state, action) => {
        const page = action?.payload?.page ?? action?.meta?.arg?.page ?? 1;
        const { posts, hasMorePosts, postsCount } = action?.payload;
        if (page === 1) {
          state.posts = [...posts];
        } else {
          state.posts = [...state.posts, ...posts];
        }
        state.hasMorePosts = hasMorePosts;
        state.loadingMorePosts = false;
        state.postPage = page;
        state.postsCount = postsCount;
      })
      .addCase(fetchPaginatedGroupPosts.rejected, (state) => {
        state.loadingMorePosts = false;
      })
      .addCase(removeFromGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromGroup.fulfilled, (state, action) => {
        const { member } = action?.payload;
        state.members = state.members.filter((user) => user._id !== member._id);
        state.admins = state.admins.filter((admin) => admin._id !== member._id);
        state.isLoading = false;
      })
      .addCase(removeFromGroup.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(makeGroupAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(makeGroupAdmin.fulfilled, (state, action) => {
        const { member } = action?.payload;
        state.admins = [...state.admins, member];
        state.isLoading = false;
      })
      .addCase(makeGroupAdmin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeFromAdmin.fulfilled, (state, action) => {
        const { member } = action?.payload;
        state.admins = state.admins.filter((admin) => admin._id !== member._id);
        state.singleGroup.admins = state.singleGroup.admins.filter((admin) => admin._id !== member._id);
        state.isLoading = false;
      })
      .addCase(removeFromAdmin.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(likeUnlikePost.fulfilled, (state, action) => {
        const updatedPost = action?.payload?.post;

        state.posts = state.posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
      })
      .addCase(deleteGroupPost.fulfilled, (state, action) => {
        const deletedPost = action?.payload?.deletedPost;
        state.posts = state.posts.filter(
          (post) => post._id !== deletedPost._id
        );
      });
  },
});

export default groupSlice.reducer;
