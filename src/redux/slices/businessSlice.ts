import { createSlice } from "@reduxjs/toolkit";

import { getBusinessInfo, inviteUserToBusiness, purchaseSeats } from "../api/businessApi";
import IBusinessResponse from "../../interfaces/business/IBusinessResponse";

export interface BusinessState {
  businessInfo: IBusinessResponse | null;
  loading: boolean;
  loaders: {
    invitingUser: boolean;
  };
  invitedUsers: any[];
}

const initialState: BusinessState = {
  businessInfo: null,
  loading: false,
  loaders: {
    invitingUser: false,
  },
  invitedUsers: [],
};

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getBusinessInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessInfo.fulfilled, (state, action) => {
        state.businessInfo = action.payload;
        state.loading = false;
      })
      .addCase(getBusinessInfo.rejected, (state) => {
        state.loading = false;
      })

      // Purchase Seats
      .addCase(purchaseSeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(purchaseSeats.fulfilled, (state, action) => {
        if (state.businessInfo) {
          state.businessInfo.availableSeats = action.payload.quantity;
        }
        state.loading = false;
      })
      .addCase(purchaseSeats.rejected, (state) => {
        state.loading = false;
      })
      // Invite User
      .addCase(inviteUserToBusiness.pending, (state) => {
        state.loaders.invitingUser = true;
      })
      .addCase(inviteUserToBusiness.fulfilled, (state, action) => {
        if (state.businessInfo) {
          state.businessInfo.invitedUsers = action.payload;
        }
        state.loaders.invitingUser = false;
      })
      .addCase(inviteUserToBusiness.rejected, (state) => {
        state.loaders.invitingUser = false;
      }),
});

const businessReducer = businessSlice.reducer;

export default businessReducer;
