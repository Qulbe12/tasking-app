import { TabsValue } from "@mantine/core";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  boardTab: TabsValue;
}

const initialState: MenuState = {
  boardTab: "Work Items",
};

const menuSlice = createSlice({
  name: "menus",
  initialState,

  reducers: {
    setBoardTab: (state, action: PayloadAction<TabsValue>) => {
      state.boardTab = action.payload;
    },
  },
});

const menuReducer = menuSlice.reducer;

export const { setBoardTab } = menuSlice.actions;

export default menuReducer;
