import { createSlice } from "@reduxjs/toolkit";

import {
  getBusinessInfo,
  inviteUserToBusiness,
  purchaseSeats,
  updateBusinessInfo,
} from "../api/businessApi";
import IBusinessResponse from "../../interfaces/business/IBusinessResponse";

export interface BusinessState {
  businessInfo: IBusinessResponse | null;
  loading: boolean;
  loaders: {
    invitingUser: boolean;
    gettingBusinessInfo: boolean;
    updatingBusinessInfo: boolean;
  };
  invitedUsers: any[];
}

const initialState: BusinessState = {
  businessInfo: null,
  loading: false,
  loaders: {
    invitingUser: false,
    gettingBusinessInfo: false,
    updatingBusinessInfo: false,
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
        state.loaders.gettingBusinessInfo = true;
      })
      .addCase(getBusinessInfo.fulfilled, (state, action) => {
        state.businessInfo = action.payload;
        state.loaders.gettingBusinessInfo = false;
      })
      .addCase(getBusinessInfo.rejected, (state) => {
        state.loaders.gettingBusinessInfo = false;
      })
      // Update Business
      .addCase(updateBusinessInfo.pending, (state) => {
        state.loaders.updatingBusinessInfo = true;
      })
      .addCase(updateBusinessInfo.fulfilled, (state, action) => {
        state.businessInfo = action.payload;
        state.loaders.updatingBusinessInfo = false;
      })
      .addCase(updateBusinessInfo.rejected, (state) => {
        state.loaders.updatingBusinessInfo = false;
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
        state.businessInfo = action.payload;

        state.loaders.invitingUser = false;
      })
      .addCase(inviteUserToBusiness.rejected, (state) => {
        state.loaders.invitingUser = false;
      }),
});

const businessReducer = businessSlice.reducer;

export default businessReducer;
