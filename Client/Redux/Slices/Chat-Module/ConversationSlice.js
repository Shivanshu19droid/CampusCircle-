import axiosInstance from "../../src/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  searchResults: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  loadingMore: false,
  resolvingConversation: false,
  resolution: null,
};

export const searchForUsers = createAsyncThunk(
  "/chat/search-queried-users",
  async ({ query, page }, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.get(
        `/chat/search?query=${query}&page=${page}`,
      );
      const res = await toast.promise(resPromise, {
        loading: "Searching for users...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to search for users",
      });

      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

export const resolveConversationState = createAsyncThunk(
  "/chat/resolve-state",
  async (clickedUserId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/chat/resolve-conversation-state/${clickedUserId}`,
      );
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

const conversationStateSlice = createSlice({
  name: "conversation-slice",
  initialState,
  reducers: {
    clearResolution: (state) => {
      state.resolution = null;
      state.resolvingConversation = false;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchForUsers.pending, (state, action) => {
        const reqPage = action?.meta?.arg?.page || 1;
        if (reqPage === 1) {
          state.isLoading = true;
          state.loadingMore = false;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(searchForUsers.fulfilled, (state, action) => {
        const { users, page, hasMore } = action?.payload;
        if (page === 1) {
          state.searchResults = [...users];
        } else {
          state.searchResults = [...state.searchResults, ...users];
        }
        state.isLoading = false;
        state.loadingMore = false;
        state.page = page;
        state.hasMore = hasMore;
      })
      .addCase(searchForUsers.rejected, (state) => {
        state.isLoading = false;
        state.loadingMore = false;
      })
      .addCase(resolveConversationState.pending, (state) => {
        state.resolvingConversation = true;
        state.resolution = null;
      })
      .addCase(resolveConversationState.fulfilled, (state, action) => {
        state.resolution = action?.payload;
        state.resolvingConversation = false;
      })
      .addCase(resolveConversationState.rejected, (state) => {
        state.resolvingConversation = false;
      });
  },
});

export default conversationStateSlice.reducer;
export const { clearResolution, clearSearchResults } = conversationStateSlice.actions;

