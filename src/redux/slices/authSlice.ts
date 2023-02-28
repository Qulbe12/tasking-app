/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { showNotification } from "@mantine/notifications";
import api from "../../config/api";
import { IAuthUser, IRegisterUser, NylasConnectedPayload } from "hexa-sdk/dist/app.api";

interface User {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk("user/login", async (user: User, { rejectWithValue }) => {
  localStorage.removeItem("token");
  try {
    const res = await api.userApi.login(user);
    localStorage.setItem("token", res.data.accessToken);
    return res.data;
  } catch (err: any) {
    const errMsg = err.response.data.Message;

    return rejectWithValue(errMsg);
  }
});

export const registerUser = createAsyncThunk("user/register", async (userInfo: IRegisterUser) => {
  localStorage.removeItem("token");
  const res = await api.userApi.register(userInfo);
  localStorage.setItem("token", res.data.accessToken);
  return res.data;
});

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
    updateUserNylasToken: (state, action: PayloadAction<NylasConnectedPayload>) => {
      if (state.user) {
        localStorage.setItem("nylasToken", action.payload.access_token);
        state.user.nylasToken = action.payload;
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
        console.log("ACTION LOG", action.payload.nylasToken);

        // @ts-ignore
        if (action.payload.nylasToken.accessToken) {
          // @ts-ignore
          localStorage.setItem("nylasToken", action.payload.nylasToken.accessToken);
        }
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading -= 1;
        console.log(action.payload);

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
        state.loading -= 1;
        state.user = action.payload;
        state.token = action.payload.accessToken;
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

export const { setAuthUser, logout, updateUserNylasToken } = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
