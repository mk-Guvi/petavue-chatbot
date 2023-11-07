export type BlockT = {
  type: 'paragraph' | 'html' | 'attachmentList' | 'image'
  text?: string
  content?: string //when type is html
  class?: string
  attachments?: AttachmentT[]
  url?: string
  width?: number
  height?: number
  previewUrl?: string
  attribution?: string
  title?: string
}

export type AttributesT = {
  identifier: string
  name: string
  type: 'string'
  value: string
  custom_bot_control_id: string
  workflow_control_id: string
  attribute_collection_overwritable: boolean
  attribute_collection_disabled: boolean
  placeholder?: string
}

export type FormT = {
  type?: 'bot_workflow' | 'notification_channel'
  attribute_collector_locked?: boolean
  attributes?: AttributesT[]
  operator_workflow_step_id?: number
  operator_workflow_state_id?: number
}
export type PartTypeT =
  | 'comment'
  | 'quick_reply'
  | 'attribute_collector'
  | 'fin_answer'
export type ReadTypeT = 'text'
export type MoodT = null | 'clarifying' | 'negative'
export type ReplyOptionT = BlockT&{
  uuid: string

}

export type AuthorT = {
  type?: string
  avatar?: {
    square_25: string
    square_50: string
    square_128: string
    shape: string
  }
  is_admin?: boolean
  is_self?: boolean
  name?: string | null
  first_name?: string | null
  is_bot?: boolean
  id?: string
  initial?: string
}

type MessageT = {
  id?: string
  sent_at?: number
  created_at?: number
  show_created_at?: boolean
  message_style: number
  delivery_option?: string
  blocks?: BlockT[]
  attachments?: AttachmentT[]
  author?: AuthorT
  seen_by_admin?: any // Define a type for seen_by_admin if needed
  reactions_reply?: any // Define a type for reactions_reply if needed
  team_author?: any // Define a type for team_author if needed
  reply_type?: string
  form?: FormT
  reply_options?: ReplyOptionT[]
  pointer_selector?: any // Define a type for pointer_selector if needed
  client_assigned_uuid?: any // Define a type for client_assigned_uuid if needed
  google_analytics_identifier?: any // Define a type for google_analytics_identifier if needed
}

type ConversationPartT = {
  id?: string
  client_assigned_uuid?: any // Define a type for client_assigned_uuid if needed
  created_at?: number
  blocks: BlockT[]
  attachments?: AttachmentT[]
  author: AuthorT
  seen_by_admin?: any // Define a type for seen_by_admin if needed
  part_type?: PartTypeT
  event_data?: any // Define a type for event_data if needed
  reply_options?: ReplyOptionT[]
  form?: FormT
  mood?: MoodT
  sources?: any // Define a type for sources if needed
}

export type ConversationT = {
  id?: string
  read?: boolean
  read_at?: number
  dismissed?: boolean
  updated_at?: number
  conversation_message?: MessageT
  conversation_parts?: ConversationPartT[]
  user_participated?: boolean
  last_participating_admin?: AuthorT
  ux_style?: any // Define a type for ux_style if needed
  participants?: any[] // Define a type for participants if needed
  composer_state?: any // Define a type for composer_state if needed
  archived?: boolean
  prevent_end_user_replies?: boolean
  prevent_end_user_replies_timestamp?: any // Define a type for prevent_end_user_replies_timestamp if needed
  analytics_metadata?: {
    custom_bot_id: number
  }
  current_channel?: string
  ticket?: any // Define a type for ticket if needed
  eligible_for_recent_conversations?: boolean
  state?: string
  is_inbound?: boolean
  ui_flags?: {
    show_last_part_meta: boolean
  }
}

type AvatarT = {
  square_25: string
  square_50: string
  square_128: string
  shape: string
}

type AdminT = {
  type: 'Admin'
  avatar: AvatarT
  is_admin: boolean
  is_self: boolean
  name: string | null
  first_name: string | null
  is_bot: boolean
  id: string
  initial: string
}

type SuggestionT = {}

export type ComposerSuggestionT = {
  prompt: BlockT[]
  parts: BlockT[]
  operator: AuthorT
  suggestions: SuggestionT[]
  composer_disabled: boolean
  updated_at: number
  ruleset_id: number
  priority: number
  snapshot_id: number
  capture_composer_control_id: number
}

type ImageUrls = {
  square_25: string | null
  square_50: string | null
  square_128: string | null
}

type AvatarDetailsT = {
  avatar_type: 'facepile'
  avatars: {
    initials: string
    color: string
    image_urls: ImageUrls
    image_url: string | null
    shape: 'squircle' | 'circle'
  }[]
}

type CtaT = {
  text: string
  subtitle: string
  icon: string | null
}

type HomeCardT = {
  text: string
  subtitle: string
  avatar_details: AvatarDetailsT
  icon: string | null
}

export type AttachmentT = {
  type: 'upload'
  name: string
  url: string
  content_type: string
  filesize: number
  width: number | null
  height: number | null
}

export type NewConversationT = {
  cta: CtaT
  home_card: HomeCardT
  parts: BlockT[] // Replace with the actual type for parts if needed
  participants: any[] // Replace with the actual type for participants if needed
}
