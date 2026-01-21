import axiosInstance from "../../src/Helpers/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { createNewGroup, joinGroup, leaveGroup } from "./GroupSlice";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data: localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : {},
};

//all the reducers (functions to interact with the backend) will be defined here

//register user
export const registerUser = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const resPromise = axiosInstance.post("/user/signup", data);
    const res = await toast.promise(resPromise, {
      loading: "Please wait while we are creating your account...",
      success: (res) => {
        return res?.data?.message;
      },
      error: "Failed to create account",
    });

    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

//login user
export const loginUser = createAsyncThunk("/auth/login", async (data) => {
  try {
    const resPromise = axiosInstance.post("/user/login", data);
    const res = await toast.promise(resPromise, {
      loading: "please wait while we are logging you in...",
      success: "You are successfully logged in to you account",
      error: "Failed to login",
    });

    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

//logout user
export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  try {
    const resPromise = axiosInstance.post("/user/logout");
    const res = await toast.promise(resPromise, {
      loading: "Logging you out...",
      success: (res) => {
        return res?.data?.message;
      },
      error: "Failed to logout",
    });

    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

//get current user on refresh
export const fetchCurrentUser = createAsyncThunk("auth/refresh", async () => {
  try {
    const res = await axiosInstance.get("/user/refresh");
    return res.data;
  } catch(error) {
    toast.error(error?.response?.data?.message);
  }
})

//fetch my profile
export const getMyProfile = createAsyncThunk("/user/my-profile", async () => {
  try {
    const res = axiosInstance.get("/user/me");
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

//edit profile

//all the cases will be defined here
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        if (action?.payload?.user) {
          localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        }
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);

        state.isLoggedIn = true;
        state.role = action?.payload?.user?.role;
        state.data = action?.payload?.user;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);

        state.isLoggedIn = true;
        state.role = action?.payload?.user?.role;
        state.data = action?.payload?.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.clear();

        state.isLoggedIn = false;
        state.role = "";
        state.data = {};
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        const { user } = action?.payload;
        localStorage.setItem("data", JSON.stringify(user));
        state.data = user;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);

        state.data = action?.payload?.user;
        state.isLoggedIn = true;
        state.role = action?.payload?.user?.role;
      })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.data.groups.push(action?.payload?.newGroup?._id);
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.data.groups.push(action?.payload?.group?._id);
      })
      .addCase(leaveGroup.fulfilled, (state, action) => {
        state.data.groups = state?.data?.groups?.filter(group => group !== action?.payload?.group?._id);
      })
  },
});

export default authSlice.reducer;
