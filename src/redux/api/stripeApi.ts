import { createAsyncThunk } from "@reduxjs/toolkit";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import IPaymentMethodsResponse from "../../interfaces/stripe/IPaymentMethodsResponse";
import ICreatePaymentMethod from "../../interfaces/stripe/ICreatePaymentMethod";
import { showNotification } from "@mantine/notifications";

// Payment Methods
export const getAllPaymentMethods = createAsyncThunk(
  "stripe/getAllPaymentMethods",
  async (method, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get<IPaymentMethodsResponse[]>("/stripe/payment-methods");
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const addPaymentMethod = createAsyncThunk(
  "stripe/addPaymentMethod",
  async (method: ICreatePaymentMethod, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.post<IPaymentMethodsResponse>(
        "/stripe/payment-methods",
        method,
      );
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const setDefaultMethod = createAsyncThunk(
  "stripe/setDefaultMethod",
  async (paymentMethodId: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get<IPaymentMethodsResponse>(
        `/stripe/payment-methods/${paymentMethodId}/set-as-default`,
      );
      await dispatch(getAllPaymentMethods());
      showNotification({
        message: "Default Payment Method Updated Successfully",
      });
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
