import { createSlice, Slice } from "@reduxjs/toolkit";
import { reset } from "../actions";

// Define the type for your initial state
export type GlobalSliceStateT = {};
type GlobalSliceT = Slice<GlobalSliceStateT, {}, "global">;

const initialState: GlobalSliceStateT = {
  loginModal: {
    isLoginModalOpen: false,
  },
};

const globalSlice: GlobalSliceT = createSlice({
  name: "global",
  initialState, // Use the explicitly typed initialState here
  reducers: {},
  extraReducers(builder) {
    builder.addCase(reset, () => {
      return initialState;
    });
  },
});

export const {} = globalSlice.actions;

export default globalSlice.reducer;
