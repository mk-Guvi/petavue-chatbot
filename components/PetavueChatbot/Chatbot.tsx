import React, { Fragment } from 'react'
import { ChatBotIcon } from './ChatbotIcon'
import ChatbotContainer from './ChatbotContainer'
import { useGlobalData } from '@/redux/selectors'
import { useChatbotPingService } from '@/services/hooks'

export function ChatBot() {
  useChatbotPingService()

  const { chatbot } = useGlobalData()
  return chatbot?.showChatbot ? (
    <Fragment>
      <ChatbotContainer />
      <ChatBotIcon />
    </Fragment>
  ) : null
}
