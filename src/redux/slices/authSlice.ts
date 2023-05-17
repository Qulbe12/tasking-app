/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../config/api";
import { IAuthUser, IRegisterUser } from "hexa-sdk/dist/app.api";
import { centralizedErrorHandler } from "../commonSliceFunctions";

interface User {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "user/login",
  async (user: User, { rejectWithValue, dispatch }) => {
    localStorage.removeItem("token");
    try {
      const res = await api.userApi.login(user);
      localStorage.setItem("token", res.data.accessToken);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (userInfo: IRegisterUser, { rejectWithValue, dispatch }) => {
    try {
      localStorage.removeItem("token");
      const res = await api.userApi.register(userInfo);
      localStorage.setItem("token", res.data.accessToken);
      return res.data;
    } catch (err: any) {
      centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export interface AuthState {
  user?: IAuthUser;
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
      localStorage.clear();
      state.token = "";
    },
    removeNylasToken: (state) => {
      localStorage.removeItem("nylasToken");

      if (state.user) {
        // @ts-ignore
        state.user.nylasToken = undefined;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading += 1;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading -= 1;
        state.user = action.payload;
        if (action.payload?.accessToken) {
          state.token = action.payload.accessToken;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading -= 1;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading += 1;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading -= 1;
        state.user = action.payload;
        if (action.payload?.accessToken) {
          state.token = action.payload.accessToken;
        }
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading -= 1;
      });
  },
});

export const { setAuthUser, logout, removeNylasToken } = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
