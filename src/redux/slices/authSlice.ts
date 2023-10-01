/* eslint-disable @typescript-eslint/ban-ts-comment */

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import IUserResponse from "../../interfaces/account/IUserResponse";
import {
  acceptInvitation,
  businessLogin,
  loginUser,
  registerUser,
  subscribeToPlan,
  updateUserAvatar,
} from "../api/authApi";

export interface AuthState {
  user?: IUserResponse;
  token: string;
  loading: boolean;
  error?: string;
  loaders: {
    updatingAvatar: boolean;
  };
}

const initialState: AuthState = {
  loading: false,
  loaders: {
    updatingAvatar: false,
  },
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
    updateName: (state, action) => {
      if (!state.user) return;
      state.user.user.name = action.payload;
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
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload?.accessToken) {
          state.token = action.payload.accessToken;
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      // Business Login
      .addCase(businessLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(businessLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload?.accessToken) {
          state.token = action.payload.accessToken;
        }
      })
      .addCase(businessLogin.rejected, (state) => {
        state.loading = false;
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload?.accessToken) {
          state.token = action.payload.accessToken;
        }
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })

      // Subscribe to Plan
      .addCase(subscribeToPlan.pending, (state) => {
        state.loading = true;
      })
      .addCase(subscribeToPlan.fulfilled, (state) => {
        state.loading = false;
        if (state.user) {
          state.user.user.subscription = "active";
        }
      })
      .addCase(subscribeToPlan.rejected, (state) => {
        state.loading = false;
      })
      // Accept Invitation
      .addCase(acceptInvitation.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload;
        if (action.payload?.accessToken) {
          state.token = action.payload.accessToken;
        }
      })
      .addCase(acceptInvitation.rejected, (state) => {
        state.loading = false;
      })
      // Update Avatar
      .addCase(updateUserAvatar.pending, (state) => {
        state.loaders.updatingAvatar = true;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.user) {
          state.user.user.avatar = action.payload;
        }

        state.loaders.updatingAvatar = false;
      })
      .addCase(updateUserAvatar.rejected, (state) => {
        state.loaders.updatingAvatar = false;
      });
  },
});

export const { setAuthUser, logout, removeNylasToken, updateName } = authSlice.actions;

const authReducer = authSlice.reducer;

export default authReducer;
