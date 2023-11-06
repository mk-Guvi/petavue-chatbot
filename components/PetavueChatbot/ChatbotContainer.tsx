import { useChatbot } from '@/services/hooks'
import React from 'react'
import MessageList from './MessageList/MessageLists'
import NewConversation from './NewConversation'

function ChatbotContainer() {
  const { chatbot } = useChatbot()
  return chatbot?.open ? (
    <div className="fixed bottom-0 right-0 flex flex-col sm:bottom-24 sm:right-6 transition duration-200 bg-white shadow-2xl sm:rounded-lg h-full w-screen  sm:h-[85%]  sm:w-[28rem]">
      {chatbot?.route === 'messages' ? (
        <MessageList />
      ) : chatbot?.route === 'new-message' ? (
        <NewConversation />
      ) : null}
    </div>
  ) : null
}

export default ChatbotContainer
