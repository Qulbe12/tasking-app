import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreatePaymentMethod, ICreateSubscription } from "hexa-sdk/dist/stripe/stripe.dtos";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";

const { stripeApi } = api;
const { paymentMethods, plans, subscriptions } = stripeApi;

// Payment Methods
export const addPaymentMethod = createAsyncThunk(
  "stripe/addPaymentMethod",
  async (method: ICreatePaymentMethod, { rejectWithValue }) => {
    try {
      const res = await paymentMethods.create(method);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getAllPaymentMethods = createAsyncThunk(
  "stripe/getAllPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const res = await paymentMethods.list();
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const setDefaultPaymentMethod = createAsyncThunk(
  "stripe/setDefaultPaymentMethod",
  async (paymentMethodId: string, { rejectWithValue }) => {
    try {
      const res = await paymentMethods.setDefault(paymentMethodId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

// Payment Plans
export const getAllPaymentPlans = createAsyncThunk(
  "stripe/getAllPaymentPlans",
  async (_, { rejectWithValue }) => {
    try {
      const res = await plans.list();
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

// Subscriptions
export const subscribeToPlan = createAsyncThunk(
  "stripe/subscribeToPlan",
  async (subscription: ICreateSubscription, { rejectWithValue }) => {
    try {
      const res = await subscriptions.create(subscription);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getAllSubscriptions = createAsyncThunk(
  "stripe/getAllSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await subscriptions.list();
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);
