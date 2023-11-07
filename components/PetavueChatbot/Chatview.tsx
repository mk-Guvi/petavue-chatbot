import { useChatbot, useNewConversation } from '@/services/hooks'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
  ChatHeader,
  ChatbotInputfield,
  IntercomLabel,
  MesaggeRenderer,
} from './chatbotComponents'
import { BlockT } from './Chatbot.types'
import { CircularLoader } from '..'
import { apiEndpoints } from '@/constants'
import { backendPost } from '@/integration'

function Chatview() {
  const { chatbot, getCommonPayload, onUpdateChatviewState } = useChatbot()

  const {
    newConversationState,
    handleNewConversationState,
    callNewMessage,
  } = useNewConversation()

  useEffect(() => {
    callConversations()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbot?.chatView?.conversation?.id])

  async function callConversations() {
    try {
      const response = await backendPost(
        `${apiEndpoints.CONVERSATIONS}/${chatbot?.chatView?.conversation?.id}`,
        getCommonPayload(),
      )
      if (response?.data?.id) {
        onUpdateChatviewState({
          conversation: response?.data,
          loading: false,
          hideInputfield:
            response?.data?.conversation_parts?.[
              response?.data?.conversation_parts?.length - 1
            ]?.part_type === 'attribute_collector',
        })
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
        onUpdateChatviewState({
          conversation: response?.data,
          loading: false,
          hideInputfield:
            response?.data?.conversation_parts?.[
              response?.data?.conversation_parts?.length - 1
            ]?.part_type === 'attribute_collector',
        })
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
                loading={newConversationState?.loading}
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
      {chatbot?.chatView?.hideInputfield ? null : (
        <ChatbotInputfield
          onEnter={function (block: BlockT): void {
            handleNewConversationState({ loading: true, block })
            callNewMessage({
              block,
              url: `${apiEndpoints.CONVERSATIONS}/${chatbot?.chatView?.conversation?.id}/reply`,
              callBack: callConversations,
            })
          }}
          disabled={newConversationState.loading}
        />
      )}
    </Fragment>
  )
}

export default Chatview
