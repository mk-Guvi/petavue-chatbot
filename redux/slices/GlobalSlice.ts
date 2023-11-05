import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { reset } from "../actions";

export type ChatbotUserT={
  id?: string;
  type?: string;
  role?: string;
  locale?: string;
  has_conversations?: boolean;
  anonymous_id?: string;
  country_code?: string;
  new_session?: boolean;
  help_center_require_search?: boolean;
  requires_cookie_consent?: boolean;
  prevent_multiple_inbound_conversation?: boolean;
  user_assignments?: Record<string, any>;
};

// Define the type for your initial state
export type ChatBotStateT={
  open:boolean
  route:"messages",
  userDetails:ChatbotUserT
  showChatbot:boolean
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

    showChatbot:false,
    route:"messages",
    userDetails:{}
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
