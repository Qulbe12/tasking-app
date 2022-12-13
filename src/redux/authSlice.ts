import { axiosPrivate } from "./../config/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserCreate, UserResponse } from "../interfaces/user.interface";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../constants/URLS";
import { showNotification } from "@mantine/notifications";

interface User {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk("user/login", async (user: User, { rejectWithValue }) => {
  try {
    console.log(user);

    const res = await axiosPrivate.post<UserResponse>(LOGIN_ROUTE, user);

    axiosPrivate.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    return res.data;
  } catch (err: any) {
    const errMsg = err.response.data.Message;

    return rejectWithValue(errMsg);
  }
});

export const registerUser = createAsyncThunk("user/register", async (userInfo: UserCreate) => {
  const res = await axiosPrivate.post<UserResponse>(REGISTER_ROUTE, userInfo);

  axiosPrivate.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

  return res.data;
});

export interface AuthState {
  user?: UserResponse["user"];
  token: string;
  loading: number;
  error?: string;
}

const initialState: AuthState = {
  loading: 0,
  token: "",
};

export const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
    },
    logout: (state: AuthState) => {
      state.token = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading += 1;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.loading -= 1;
        state.user = user;
        state.token = token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading -= 1;
        state.error = action.error.message;

        showNotification({
          title: "Error",
          message: action.error.message,
        });
      })
      .addCase(registerUser.pending, (state) => {
        state.loading += 1;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.loading -= 1;
        state.user = user;
        state.token = token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading -= 1;
        state.error = action.error.message;

        showNotification({
          title: "Error",
          message: action.error.message,
        });
      });
  },
});

export const { setAuthUser, logout } = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
