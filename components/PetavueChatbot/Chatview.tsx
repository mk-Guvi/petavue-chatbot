import { useChatbot, useNewConversation } from '@/services/hooks'
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  ChatBotReplyLoader,
  ChatHeader,
  ChatbotInputfield,
  IntercomLabel,
  MesaggeRenderer,
} from './chatbotComponents'
import { BlockT, ConversationT, ReplyOptionT } from './Chatbot.types'
import { CircularLoader } from '..'
import { apiEndpoints } from '@/constants'
import { backendPost } from '@/integration'
import { updateChatviewState } from '@/redux/slices'

export type OnQuickReplayPayloadT = {
  id: string
  reply_option: ReplyOptionT
}
export type OnFormReplayPayloadT = {
  identifier: string
  value: string
  conversation_part_id: string
}
function Chatview() {
  const { chatbot, getCommonPayload, onUpdateChatviewState } = useChatbot()
  const [replayLoading, setReplayLoading] = useState(
    chatbot?.chatView?.isNewChannel,
  )

  const {
    newConversationState,
    handleNewConversationState,
    callNewMessage,
    checkHideInputField
  } = useNewConversation()

  useEffect(() => {
    callConversations()
    if (chatbot?.chatView?.isNewChannel) {
      callDelayedConversation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbot?.chatView?.conversation?.id])

  const callDelayedConversation = (ignoreReplayLoading?: boolean) => {
    setReplayLoading(!ignoreReplayLoading)
    setTimeout(async () => {
      await callConversations()
      setReplayLoading(false)
      updateChatviewState({ isNewChannel: false })
      handleNewConversationState({ block: null })
    }, 5000)
  }

  

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
          hideInputfield: checkHideInputField(response?.data),
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
          hideInputfield: checkHideInputField(response?.data),
        })
      } else {
        onUpdateChatviewState({ loading: false })
      }
    } catch (e) {
      console.log(e)
      onUpdateChatviewState({ loading: false })
    }
  }

  const onQuickReplay = useCallback((payload: OnQuickReplayPayloadT) => {
    callNewMessage({
      quickReplay: payload,
      url: `${apiEndpoints.CONVERSATIONS}/${chatbot?.chatView?.conversation?.id}/quick_reply`,
      callBack: callDelayedConversation,
      ignoreConversationUpdate: true,
    })
  }, [])

  const onFormReplay = useCallback(async (payload: OnFormReplayPayloadT) => {
    await callNewMessage({
      formReplay: payload,
      url: `${apiEndpoints.CONVERSATIONS}/${chatbot?.chatView?.conversation?.id}/form`,
      callBack: () => callDelayedConversation(true),
      ignoreConversationUpdate: false,
    })
  }, [])

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
              onQuickReplay={onQuickReplay}
              onFormReplay={onFormReplay}
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
        {replayLoading ? <ChatBotReplyLoader /> : null}
      </section>
      <IntercomLabel />
      {chatbot?.chatView?.hideInputfield ? null : (
        <ChatbotInputfield
          onEnter={function (block: BlockT): void {
            handleNewConversationState({ loading: true, block })
            callNewMessage({
              block,
              url: `${apiEndpoints.CONVERSATIONS}/${chatbot?.chatView?.conversation?.id}/reply`,
              callBack: callDelayedConversation,
              ignoreConversationUpdate: true,
            })
          }}
          disabled={newConversationState.loading || replayLoading}
        />
      )}
    </Fragment>
  )
}

export default Chatview
