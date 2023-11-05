import { useChatbot } from '@/services/hooks'
import React from 'react'

function ChatbotContainer() {
  const { chatbot } = useChatbot()
  return chatbot?.open ? (
    <div className="fixed bottom-24 right-6 transition duration-200 bg-white shadow-2xl rounded-lg  md:h-[80%]  md:w-[25rem]">
      container
    </div>
  ) : null
}

export default ChatbotContainer
