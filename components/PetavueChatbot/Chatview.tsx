import { useChatbot, useNewConversation } from '@/services/hooks'
import React, { Fragment, useEffect, useState } from 'react'
import {
  ChatHeader,
  ChatbotInputfield,
  IntercomLabel,
  MesaggeRenderer,
} from './chatbotComponents'
import { BlockT, ConversationT } from './Chatbot.types'
import tw from 'tailwind-styled-components'
import { CircularLoader, H5, Icon, MediumText, SmallText } from '..'
import Image from 'next/image'
import { LANG, apiEndpoints } from '@/constants'
import { backendPost } from '@/integration'

function Chatview() {
  const { chatbot, getCommonPayload, onUpdateChatviewState } = useChatbot()
  const {
    newConversationState,
    handleNewConversationState,
  } = useNewConversation()
  const [changeWatcher, setChangeWatcher] = useState(0)

  useEffect(() => {
    callConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeWatcher, chatbot?.chatView?.conversation?.id])

  function recordChanges() {
    setChangeWatcher((prev) => prev + 1)
  }
  async function callConversations() {
    try {
      const response = await backendPost(
        `${apiEndpoints.CONVERSATIONS}/${chatbot?.chatView?.conversation?.id}`,
        getCommonPayload(),
      )
      if (response?.data?.id) {
        onUpdateChatviewState({ conversation: response?.data, loading: false })
        if (!response?.data?.read) {
          callConversationsRead() //TO UPDATE AS READ
        }
      } else {
        onUpdateChatviewState({ loading: false })
      }
    } catch (e) {
      console.log(e)
      onUpdateChatviewState({ loading: false })
    }
  }

  async function callConversationsRead() {
    try {
      const response = await backendPost(
        `${apiEndpoints.CONVERSATIONS}/${chatbot?.chatView?.conversation?.id}/read`,
        getCommonPayload(),
      )
      if (response?.data?.id) {
        onUpdateChatviewState({ conversation: response?.data, loading: false })
      } else {
        onUpdateChatviewState({ loading: false })
      }
    } catch (e) {
      console.log(e)
      onUpdateChatviewState({ loading: false })
    }
  }

  return (
    <Fragment>
      <ChatHeader allowToggle />
      <section
        className={`flex-1  flex flex-col gap-4 overflow-auto p-4 ${
          chatbot?.chatView?.loading ? 'justify-center items-center' : ''
        }`}
      >
        {' '}
        {chatbot?.chatView?.loading ? (
          <CircularLoader />
        ) : (
          <Fragment>
            {' '}
            <MesaggeRenderer
              message={{
                ...chatbot?.chatView?.conversation,
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
          </Fragment>
        )}
      </section>
      <IntercomLabel />
      <ChatbotInputfield
        onEnter={function (block: BlockT): void {
          handleNewConversationState({ loading: true, block })
        }}
        disabled={newConversationState.loading}
      />
    </Fragment>
  )
}

export default Chatview
const Header = tw.header`flex py-4 px-1.5 justify-between `
const ActionIcon = tw(
  Icon,
)` text-blue-600 hover:bg-blue-100 p-3 !h-14 cursor-pointer !w-14 rounded-2xl transition-all duration-300`
