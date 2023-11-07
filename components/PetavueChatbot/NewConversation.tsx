import React, { Fragment, useState } from 'react'
import tw from 'tailwind-styled-components'
import { H4, H5, Icon, LargeText, MediumText, SmallText } from '..'
import { useChatbot, useNewConversation } from '@/services/hooks'
import { ChatbotSvg } from './ChatbotSvg'
import Image from 'next/image'
import { LANG } from '@/constants'
import {
  ChatHeader,
  ChatbotInputfield,
  IntercomLabel,
  MesaggeRenderer,
} from './chatbotComponents'

function NewConversation() {
  const { chatbot } = useChatbot()
  const {
    newConversationState,
    handleNewConversationState,
  } = useNewConversation()

  return (
    <Fragment>
      <ChatHeader isDetailedView />

      <section className="flex-1  flex flex-col gap-4 overflow-auto p-4">
        {' '}
        <MesaggeRenderer
          message={{
            ...chatbot?.newConversationState?.defaultMessage,
          }}
        />
        {newConversationState?.block ? (
          <MesaggeRenderer
            message={{
              conversation_parts: [
                {
                  author: {
                    is_self: true,
                  },
                  blocks: [newConversationState?.block],
                },
              ],
            }}
          />
        ) : null}
      </section>
      <IntercomLabel />
      <ChatbotInputfield
        disabled={newConversationState.loading}
        onEnter={(block) => {
          handleNewConversationState({ loading: true, block })
        }}
      />
    </Fragment>
  )
}

export default NewConversation
const Header = tw.header`flex py-4 px-1.5 justify-between `
const ActionIcon = tw(
  Icon,
)` text-blue-600 hover:bg-blue-100 p-3 !h-14 cursor-pointer !w-14 rounded-2xl transition-all duration-300`
