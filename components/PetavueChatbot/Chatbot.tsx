import React, { Fragment } from 'react'

import ChatbotContainer from './ChatbotContainer'
import { useGlobalData } from '@/redux/selectors'
import { useChatbotPingService } from '@/services/hooks'
import { ChatBotIcon } from './chatbotComponents/components'

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
