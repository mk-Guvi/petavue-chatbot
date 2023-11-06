export type BlockT = {
  type: "paragraph" | "html";
  text?: string;
  content?: string; //when type is html
  class?: string;
};

export type FormT = {
  type: "bot_workflow";
  attributes: [
    {
      identifier: string;
      name: string;
      type: "string";
      value: string;
      custom_bot_control_id: string;
      workflow_control_id: string;
      attribute_collection_overwritable: boolean;
      attribute_collection_disabled: boolean;
    }
  ];
  operator_workflow_step_id: number;
  operator_workflow_state_id: number;
};
export type PartTypeT =
  | "comment"
  | "quick_reply"
  | "attribute_collector"
  | "fin_answer";
export type ReadTypeT = "text";
export type MoodT = null | "clarifying" | "negative";
export type ReplyOptionT = {
  uuid: string;
  text?: string;
  type: PartTypeT;
};


export type AuthorT = {
    type: string;
    avatar: {
      square_25: string;
      square_50: string;
      square_128: string;
      shape: string;
    };
    is_admin: boolean;
    is_self: boolean;
    name: string | null;
    first_name: string | null;
    is_bot: boolean;
    id: string;
    initial: string;
  };
  
  
  type MessageT = {
    id: string;
    sent_at: number;
    created_at: number;
    show_created_at: boolean;
    message_style: number;
    delivery_option: string;
    blocks: BlockT[];
    attachments: any[]; // Define a type for attachments if needed
    author: AuthorT;
    seen_by_admin: any; // Define a type for seen_by_admin if needed
    reactions_reply: any; // Define a type for reactions_reply if needed
    team_author: any; // Define a type for team_author if needed
    reply_type: string;
    form:FormT
    reply_options: ReplyOptionT[]; 
    pointer_selector: any; // Define a type for pointer_selector if needed
    client_assigned_uuid: any; // Define a type for client_assigned_uuid if needed
    google_analytics_identifier: any; // Define a type for google_analytics_identifier if needed
  };
  
  type ConversationPartT = {
    id: string;
    client_assigned_uuid: any; // Define a type for client_assigned_uuid if needed
    created_at: number;
    blocks: BlockT[];
    attachments: any[]; // Define a type for attachments if needed
    author: AuthorT;
    seen_by_admin: any; // Define a type for seen_by_admin if needed
    part_type: PartTypeT;
    event_data: any; // Define a type for event_data if needed
    reply_options: ReplyOptionT[]; 
    form?: FormT; 
    mood:MoodT
    sources: any; // Define a type for sources if needed
  };
  
  export type ConversationT = {
    id: string;
    read: boolean;
    read_at: number;
    dismissed: boolean;
    updated_at: number;
    conversation_message: MessageT;
    conversation_parts: ConversationPartT[];
    user_participated: boolean;
    last_participating_admin: AuthorT;
    ux_style: any; // Define a type for ux_style if needed
    participants: any[]; // Define a type for participants if needed
    composer_state: any; // Define a type for composer_state if needed
    archived: boolean;
    prevent_end_user_replies: boolean;
    prevent_end_user_replies_timestamp: any; // Define a type for prevent_end_user_replies_timestamp if needed
    analytics_metadata: {
      custom_bot_id: number;
    };
    current_channel: string;
    ticket: any; // Define a type for ticket if needed
    eligible_for_recent_conversations: boolean;
    state: string;
    is_inbound: boolean;
    ui_flags: {
      show_last_part_meta: boolean;
    };
  };
  
