import { createSlice } from "@reduxjs/toolkit";
import { IPlan } from "hexa-sdk/dist/stripe/stripe.dtos";
import {
  addPaymentMethod,
  getAllPaymentMethods,
  getAllPaymentPlans,
  subscribeToPlan,
} from "../api/stripeApi";
import { showError } from "../commonSliceFunctions";

// TODO: handle errors
export interface StripeState {
  loading: number;
  plans: IPlan[];
  paymentMethods: any[];
  loaders: {
    gettingPlans: boolean;
    gettingPaymentMethods: boolean;
    addingPaymentMethod: boolean;
  };
}

const initialState: StripeState = {
  loading: 0,
  plans: [],
  paymentMethods: [],
  loaders: {
    gettingPlans: false,
    gettingPaymentMethods: false,
    addingPaymentMethod: false,
  },
};

export const stripeSlice = createSlice({
  name: "stripe",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      // Get all payment plans
      .addCase(getAllPaymentPlans.pending, (state) => {
        state.loaders.gettingPlans = true;
      })
      .addCase(getAllPaymentPlans.fulfilled, (state, action) => {
        state.loaders.gettingPlans = false;
        state.plans = action.payload;
      })
      .addCase(getAllPaymentPlans.rejected, (state, action) => {
        state.loaders.gettingPlans = false;
        showError(action.error.message);
      })
      // Get Payment Methods
      .addCase(getAllPaymentMethods.pending, (state) => {
        state.loaders.gettingPaymentMethods = true;
      })
      .addCase(getAllPaymentMethods.fulfilled, (state, action) => {
        state.loaders.gettingPaymentMethods = false;
        state.paymentMethods = action.payload;
      })
      .addCase(getAllPaymentMethods.rejected, (state, action) => {
        state.loaders.gettingPaymentMethods = false;
        showError(action.error.message);
      })
      // Add payment method
      .addCase(addPaymentMethod.pending, (state, action) => {
        state.loaders.addingPaymentMethod = true;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.loaders.addingPaymentMethod = false;
        state.paymentMethods.push(action.payload);
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.loaders.addingPaymentMethod = false;
        showError(action.error.message);
      })
      // Create subscription
      .addCase(subscribeToPlan.pending, (state) => {
        //
      })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        //
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        showError(action.error.message);
      }),
});

const stripeReducer = stripeSlice.reducer;

export default stripeReducer;
