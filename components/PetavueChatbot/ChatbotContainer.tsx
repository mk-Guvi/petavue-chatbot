import { useChatbot } from '@/services/hooks'
import React from 'react'
import MessageList from './MessageList/MessageLists'
import NewConversation from './NewConversation'
import Chatview from './Chatview'

function ChatbotContainer() {
  const { chatbot } = useChatbot()
  return chatbot?.open ? (
    <div className="fixed bottom-0 right-0 flex flex-col sm:bottom-[5.5rem] sm:right-6 transition duration-200 bg-white shadow-2xl border sm:rounded-lg h-full w-screen  sm:h-[85%]  sm:w-[25rem]">
      {chatbot?.route === 'messages' ? (
        <MessageList />
      ) : chatbot?.route === 'new-message' ? (
        <NewConversation />
      ) : (
        <Chatview />
      )}
    </div>
  ) : null
}

export default ChatbotContainer
