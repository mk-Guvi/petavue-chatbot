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
  const { chatbot, getCommonPayload, onBackToMessages } = useChatbot()
  const {
    newConversationState,
    handleNewConversationState,
  } = useNewConversation()

  const [state, setState] = useState<{
    loading: boolean
    conversation?: ConversationT
  }>({
    loading: true,
    conversation: chatbot?.chatView,
  })
  useEffect(() => {
    callConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbot?.chatView])

  async function callConversations() {
    try {
      const response = await backendPost(
        `${apiEndpoints.CONVERSATIONS}/${chatbot?.chatView?.id}`,
        getCommonPayload(),
      )
      if (response?.data?.id) {
        setState({ conversation: response?.data, loading: false })
      } else {
        setState({ loading: false })
      }
    } catch (e) {
      console.log(e)
      setState({ loading: false })
    }
  }
  return (
    <Fragment>
      <ChatHeader allowToggle />
      <section
        className={`flex-1  flex flex-col gap-4 overflow-auto p-4 ${
          state?.loading ? 'justify-center items-center' : ''
        }`}
      >
        {' '}
        {state?.loading ? (
          <CircularLoader />
        ) : (
          <Fragment>
            {' '}
            <MesaggeRenderer
              message={{
                ...state?.conversation,
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
