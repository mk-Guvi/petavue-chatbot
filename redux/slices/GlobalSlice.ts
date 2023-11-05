import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { reset } from "../actions";

// Define the type for your initial state
export type ChatBotStateT={
  open:boolean
  route:"messages"
}
export type GlobalSliceStateT = {
  chatbot:ChatBotStateT
};
type GlobalSliceT = Slice<GlobalSliceStateT, {
  updateChatbotData: (state: GlobalSliceStateT,action:PayloadAction<Partial<ChatBotStateT>>) => void;
}, "global">;

const initialState: GlobalSliceStateT = {
  chatbot: {
    open:false,
    route:"messages"
  },
};

const globalSlice: GlobalSliceT = createSlice({
  name: "global",
  initialState, // Use the explicitly typed initialState here
  reducers: {
    
    updateChatbotData: (state, action) => {
      state.chatbot = {...state.chatbot,...action.payload}
    },
  },
  extraReducers(builder) {
    builder.addCase(reset, () => {
      return initialState;
    });
  },
});

export const {updateChatbotData} = globalSlice.actions;

export default globalSlice.reducer;
