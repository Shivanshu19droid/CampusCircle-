import axiosInstance from "../../src/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  receivedRequests: [],
  sentRequests: [],
  isLoading: false,
  loadingReceived: false,
  hasMoreReceived: true,
  loadingSent: false,
  hasMoreSent: true,
  receivedPage: 1,
  sentPage: 1,
};

export const getAllReceivedRequests = createAsyncThunk(
  "/requests/get-received-requests",
  async ({ page }, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.get(
        `/message-requests/received-requests?page=${page}`,
      );
      const res = await toast.promise(resPromise, {
        loading: "Loading received requests...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to load received requests",
      });

      return res.data;

    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

export const getAllSentRequests = createAsyncThunk(
  "/requests/get-sent-requests",
  async ({ page }, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.get(
        `/message-requests/sent-requests?page=${page}`,
      );
      const res = await toast.promise(resPromise, {
        loading: "Loading received requests...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to load sent requests",
      });

      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

export const cancelSentRequest = createAsyncThunk(
  "/requests/cancel-sent-request",
  async (requestId, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.delete(
        `/message-requests/cancel-request/${requestId}`,
      );
      const res = await toast.promise(resPromise, {
        loading: "Cancelling request...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to cancel request",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

export const acceptRequest = createAsyncThunk(
  "/requests/accept-request",
  async (requestId, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.post(
        `/message-requests/accept-request/${requestId}`,
      );

      const res = await toast.promise(resPromise, {
        loading: "Accepting request...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to accept request",
      });

      return res.data; // should contain requestId + chat
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

export const rejectRequest = createAsyncThunk(
  "/requests/reject-request",
  async (requestId, { rejectWithValue }) => {
    try {
      const resPromise = axiosInstance.put(
        `/message-requests/reject-request/${requestId}`,
      );

      const res = await toast.promise(resPromise, {
        loading: "Rejecting request...",
        success: (res) => {
          return res?.data?.message;
        },
        error: "Failed to reject request",
      });

      return requestId; // backend may not need to return anything
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

export const newMessageRequest = createAsyncThunk(
  "/requests/new-request",
  async ({ clickedUserId, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        `/message-requests/new-request/${clickedUserId}`,
        data,
      );
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data);
    }
  },
);

const messageRequestSlice = createSlice({
  name: "message-requests",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllReceivedRequests.pending, (state, action) => {
        const reqPage = action?.meta?.arg?.page || 1;
        if (reqPage === 1) {
          state.isLoading = true;
          state.loadingReceived = false;
        } else {
          state.loadingReceived = true;
        }
      })
      .addCase(getAllReceivedRequests.fulfilled, (state, action) => {
        const { receivedRequests, page, hasMore } = action?.payload;
        if (page === 1) {
          state.receivedRequests = [...receivedRequests];
        } else {
          state.receivedRequests = [
            ...state.receivedRequests,
            ...receivedRequests,
          ];
        }
        state.loadingReceived = false;
        state.isLoading = false;
        state.receivedPage = page;
        state.hasMoreReceived = hasMore;
      })
      .addCase(getAllReceivedRequests.rejected, (state) => {
        state.isLoading = false;
        state.loadingReceived = false;
      })
      .addCase(getAllSentRequests.pending, (state, action) => {
        const reqPage = action?.meta?.arg?.page || 1;
        if (reqPage === 1) {
          state.isLoading = true;
          state.loadingSent = false;
        } else {
          state.loadingSent = true;
        }
      })
      .addCase(getAllSentRequests.fulfilled, (state, action) => {
        const { sentRequests, page, hasMore } = action?.payload;
        if (page === 1) {
          state.sentRequests = [...sentRequests];
        } else {
          state.sentRequests = [
            ...state.sentRequests,
            ...sentRequests,
          ];
        }
        state.loadingSent = false;
        state.isLoading = false;
        state.sentPage = page;
        state.hasMoreSent = hasMore;
      })
      .addCase(getAllSentRequests.rejected, (state) => {
        state.isLoading = false;
        state.loadingSent = false;
      });
  },
});

export default messageRequestSlice.reducer;

