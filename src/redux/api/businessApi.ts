import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosPrivate } from "../../config/axios";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import IBusinessResponse from "../../interfaces/business/IBusinessResponse";
import { showNotification } from "@mantine/notifications";

export const getBusinessInfo = createAsyncThunk(
  "business/getBusinessInfo",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get<IBusinessResponse>("/business");
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
export const updateBusinessInfo = createAsyncThunk(
  "business/updateBusinessInfo",
  async (
    { values }: { values: { name: string; jobTitle: string } },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.patch<IBusinessResponse>("/business", values);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const purchaseSeats = createAsyncThunk(
  "business/purchaseSeats",
  async (seats: number, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get(`/stripe/subscriptions/buy-seats/${seats}`);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const inviteUserToBusiness = createAsyncThunk(
  "business/inviteUserToBusiness",
  async (email: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get(`/business/invite/${email}`);
      showNotification({
        message: "Invitation Sent",
      });
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
