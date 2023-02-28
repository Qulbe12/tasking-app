import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showNotification } from "@mantine/notifications";
import api from "../../config/api";
import { IAuthUser, IRegisterUser } from "hexa-sdk/dist/app.api";

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading += 1;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading -= 1;
        state.user = action.payload;
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

export const { setAuthUser, logout } = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
