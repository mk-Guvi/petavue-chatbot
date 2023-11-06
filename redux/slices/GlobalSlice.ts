import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { reset } from "../actions";
import { ComposerSuggestionT, ConversationT, NewConversationT } from "@/components/PetavueChatbot/Chatbot.types";
import { LANG } from "@/constants";

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
type NewConversationStateT={
  defaultMessage?:ConversationT
  
}
// Define the type for your initial state
export type ChatBotStateT={
  open:boolean
  route:"messages"|"new-message"|"chat-view",
  userDetails:ChatbotUserT
  showChatbot:boolean
  conversations:ConversationT[]
  composerSuggestions?:ComposerSuggestionT
  newConversation?:NewConversationT,
  newConversationState:NewConversationStateT,
  chatView?:ConversationT
}
export type GlobalSliceStateT = {
  chatbot:ChatBotStateT
};
type GlobalSliceT = Slice<GlobalSliceStateT, {
  updateChatbotData: (state: GlobalSliceStateT,action:PayloadAction<Partial<ChatBotStateT>>) => void;
  updateNewConversationData: (state: GlobalSliceStateT,action:PayloadAction<Partial<NewConversationStateT>>) => void;
}, "global">;

const initialState: GlobalSliceStateT = {
  chatbot: {
    conversations:[],
    open:false,
    newConversationState:{
      
    },

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
    updateNewConversationData(state, action) {
     state.chatbot.newConversationState={...state.chatbot.newConversationState,...action.payload} 
    }
    
  },
  extraReducers(builder) {
    builder.addCase(reset, () => {
      return initialState;
    });
  },
});

export const {updateChatbotData,updateNewConversationData} = globalSlice.actions;

export default globalSlice.reducer;
