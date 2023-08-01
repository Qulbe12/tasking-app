import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosPrivate } from "../../config/axios";
import IUserResponse from "../../interfaces/account/IUserResponse";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import IRegisterUser from "../../interfaces/account/IRegisterUser";
import { IAuthUser } from "hexa-sdk";

interface User {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "user/login",
  async (user: User, { rejectWithValue, dispatch }) => {
    localStorage.removeItem("token");
    try {
      const res = await axiosPrivate.post<IUserResponse>("/users/login", user);
      localStorage.setItem("token", res.data.accessToken);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const businessLogin = createAsyncThunk(
  "user/businessLogin",
  async (user: User & { businessCode: string }, { rejectWithValue, dispatch }) => {
    localStorage.removeItem("token");
    try {
      const res = await axiosPrivate.post<IUserResponse>("/users/business-login", user);
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
      const res = await axiosPrivate.post("/users/register", userInfo);
      localStorage.setItem("token", res.data.accessToken);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const subscribeToPlan = createAsyncThunk(
  "auth/subscribeToPlan",
  async (planId: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.post("/stripe/subscriptions", { planId });
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const acceptInvitation = createAsyncThunk(
  "auth/acceptInvitation",
  async (
    { invitationId, token }: { invitationId: string; token: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      localStorage.removeItem("token");
      const res = await axiosPrivate.get<IAuthUser>(
        `/users/accept-invitation/${invitationId}/${token}`,
      );
      localStorage.setItem("token", res.data.accessToken);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
