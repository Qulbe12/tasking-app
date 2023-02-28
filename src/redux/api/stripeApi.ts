import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreatePaymentMethod, ICreateSubscription } from "hexa-sdk/dist/stripe/stripe.dtos";
import api from "../../config/api";

const { stripeApi } = api;
const { paymentMethods, plans, subscriptions } = stripeApi;

// Payment Methods
export const addPaymentMethod = createAsyncThunk(
  "stripe/addPaymentMethod",
  async (method: ICreatePaymentMethod) => (await paymentMethods.create(method)).data,
);

export const getAllPaymentMethods = createAsyncThunk(
  "stripe/getAllPaymentMethods",
  async () => (await paymentMethods.list()).data,
);

export const setDefaultPaymentMethod = createAsyncThunk(
  "stripe/setDefaultPaymentMethod",
  async (paymentMethodId: string) => (await paymentMethods.setDefault(paymentMethodId)).data,
);

// Payment Plans
export const getAllPaymentPlans = createAsyncThunk(
  "stripe/getAllPaymentPlans",
  async () => (await plans.list()).data,
);

// Subscriptions
export const subscribeToPlan = createAsyncThunk(
  "stripe/subscribeToPlan",
  async (subscription: ICreateSubscription) => (await subscriptions.create(subscription)).data,
);

export const getAllSubscriptions = createAsyncThunk(
  "stripe/getAllSubscriptions",
  async () => (await subscriptions.list()).data,
);
