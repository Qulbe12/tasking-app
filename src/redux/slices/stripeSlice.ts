import { createSlice } from "@reduxjs/toolkit";
import IPaymentMethodsResponse from "../../interfaces/stripe/IPaymentMethodsResponse";
import { addPaymentMethod, getAllPaymentMethods, setDefaultMethod } from "../api/stripeApi";

export interface StripeState {
  loading: number;
  plans: any[];
  paymentMethods: IPaymentMethodsResponse[];
  loaders: {
    gettingPlans: boolean;
    gettingPaymentMethods: boolean;
    addingPaymentMethod: boolean;
    settingDefaultMethod: boolean;
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
    settingDefaultMethod: false,
  },
};

export const stripeSlice = createSlice({
  name: "stripe",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllPaymentMethods.pending, (state) => {
        state.loaders.gettingPaymentMethods = true;
      })
      .addCase(getAllPaymentMethods.fulfilled, (state, action) => {
        if (action.payload) {
          state.paymentMethods = action.payload;
        }
        state.loaders.gettingPaymentMethods = false;
      })
      .addCase(getAllPaymentMethods.rejected, (state) => {
        state.loaders.gettingPaymentMethods = false;
      })

      // Add Payment Method
      .addCase(addPaymentMethod.pending, (state) => {
        state.loaders.addingPaymentMethod = true;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        if (action.payload) {
          state.paymentMethods.push(action.payload);
        }
        state.loaders.addingPaymentMethod = false;
      })
      .addCase(addPaymentMethod.rejected, (state) => {
        state.loaders.addingPaymentMethod = false;
      })
      // Set Default Payment Method
      .addCase(setDefaultMethod.pending, (state) => {
        state.loaders.settingDefaultMethod = true;
      })
      .addCase(setDefaultMethod.fulfilled, (state) => {
        state.loaders.settingDefaultMethod = false;
      })
      .addCase(setDefaultMethod.rejected, (state) => {
        state.loaders.settingDefaultMethod = false;
      }),
});

const stripeReducer = stripeSlice.reducer;

export default stripeReducer;
