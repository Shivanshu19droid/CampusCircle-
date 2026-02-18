import axiosInstance from "../../src/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  chats: [],
  isLoading: false,
  chatPage: 1,
  hasMoreChats: true,
  loadingMoreChats: false,
  openedChat: null,
  openMessages: [],
  hasMoreMessages: true,
  loadingMoreMessages: false,
  messagePage: 1,
  messageCount: 0,
};

export const getAllChats = createAsyncThunk(
  "/chat/all-chats",
  async ({ page }) => {
    try {
      const resPromise = axiosInstance.get(`/chat/get-chats?page=${page}`);
      const res = await toast.promise(resPromise, {
        loading: "Loading chats...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to load chats",
      });

      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load chats");
    }
  },
);

export const markChatAsRead = createAsyncThunk(
  "chat/mark-read",
  async (chatId, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/chat/mark-read/${chatId}`);

      return chatId; // return chatId so reducer knows what to update
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

export const deleteChat = createAsyncThunk(
  "/chat/delete-chat",
  async (chatId, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.delete(`/chat/delete-chat/${chatId}`);
      const res = await toast.promise(resPromise, {
        loading: "Deleting chat...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to delete chat",
      });

      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete chat");
      return rejectWithValue(error.response?.data);
    }
  },
);

export const createNewChat = createAsyncThunk(
  "/char/new-chat",
  async ({ clickedUserId, data }, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.post(
        `/chat/new-chat/${clickedUserId}`,
        data,
      );
      const res = await toast.promise(resPromise, {
        loading: "Creating new chat...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to create new chat",
      });

      return res.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create new chat",
      );
      return rejectWithValue(error.response?.data);
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllChats.pending, (state, action) => {
        const reqPage = action?.meta?.arg?.page || 1
        if (reqPage === 1) {
          state.isLoading = true;
          state.loadingMoreChats = false;
        } else {
          state.loadingMoreChats = true;
        }
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        const { chats, page, hasMore } = action?.payload;
        if (page === 1) {
          state.chats = [...chats];
        } else {
          state.chats = [...state.chats, ...chats];
        }
        state.chatPage = page;
        state.hasMoreChats = hasMore;
        state.isLoading = false;
        state.loadingMoreChats = false;
      })
      .addCase(getAllChats.rejected, (state) => {
        state.isLoading = false;
        state.loadingMoreChats = false;
      })
      .addCase(markChatAsRead.fulfilled, (state, action) => {
        const { userId, chatId } = action.payload;

        const chat = state.chats.find((c) => c._id === chatId);

        if (chat) {
          if (!chat.unreadCount) {
            chat.unreadCount = {};
          }

          chat.unreadCount[userId] = 0;
        }
      })
      .addCase(deleteChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        const { chatId } = action?.payload;
        state.chats = state.chats.filter((chat) => chat._id !== chatId);
        if(state.openedChat?._id === chatId) {
            state.openedChat = null;
            state.openMessages = []
        }
        state.isLoading = false;
      })
      .addCase(deleteChat.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createNewChat.fulfilled, (state, action) => {
        const { chat, newMessage } = action?.payload;
        state.chats = [chat, ...state.chats];
        state.openedChat = chat;
        state.openMessages = [newMessage];
      })
  },
});

export default chatSlice.reducer;
