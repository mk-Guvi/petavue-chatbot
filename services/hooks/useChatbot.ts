import { apiEndpoints } from '@/constants'
import { backendPost } from '@/integration'
import { useGlobalData } from '@/redux/selectors'
import { ChatBotStateT, updateChatbotData } from '@/redux/slices'
import { generateBaseUrl } from '@/utils'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { appService } from '../appService'
import { BlockT } from '@/components/PetavueChatbot/Chatbot.types'
import axios from 'axios'
import dayjs from 'dayjs'

export const useChatbot = () => {
  const { chatbot } = useGlobalData()
  const dispatch = useDispatch()

  const updateChatbotDetails = (payload: Partial<ChatBotStateT>) => {
    dispatch(updateChatbotData(payload))
  }

  const onBackToMessages = () => {
    updateChatbotDetails({ route: 'messages' })
  }

  const callChabotOpenApi = async () => {
    try {
      const response = await backendPost(apiEndpoints.OPEN, getCommonPayload())
      if (response?.data?.composer_suggestions) {
        updateChatbotDetails({
          composerSuggestions: response?.data?.composer_suggestions,
          newConversation: response?.data?.new_conversation,
        })
      }
    } catch (e) {
      console.log(e)
    }
  }
  const toggleChat = () => {
    let open = !chatbot.open
    updateChatbotDetails({ open })
    callChabotOpenApi()
  }

  const getCommonPayload = () => {
    let payload: Record<string, any> = {
      app_id: 'uudolkfi',
      v: 3,
      g: '118279c3214aeaf35e93dba3e2224edfc9aabaa8',
      s: 'd80da787-c5dd-43a7-846f-7b414cdbcae3',
      'Idempotency-Key': '2d1347f813d62817',
      referer: generateBaseUrl(),
    }

    let anonymous_id = ''
    if (chatbot?.userDetails?.anonymous_id) {
      anonymous_id = chatbot?.userDetails?.anonymous_id
    } else {
      let userDetails = appService?.getUserDetails()
      if (userDetails?.anonymous_id) {
        updateChatbotDetails({ userDetails })
        anonymous_id = userDetails?.anonymous_id
      }
    }

    if (anonymous_id) {
      payload['user_data'] = JSON.stringify({
        anonymous_id,
      })
    }
    return payload
  }

  /**
   * The function `getConversations` is an asynchronous function that retrieves conversations from a
   * backend API and updates the state with the retrieved data.
   */
  const updateConversations = async () => {
    try {
      const response = await backendPost(
        apiEndpoints.CONVERSATIONS,
        getCommonPayload(),
      )

      updateChatbotDetails({
        conversations: [...(response?.data?.conversations || [])],
      })
    } catch (e) {
      console.log(e)
    }
  }

  return {
    chatbot,
    updateChatbotDetails,
    getCommonPayload,
    toggleChat,
    onBackToMessages,
    updateConversations,
  }
}

export const useChatbotPingService = () => {
  const { getCommonPayload, updateChatbotDetails } = useChatbot()
  useEffect(() => {
    ;(async () => {
      try {

        const result = await backendPost(apiEndpoints.PING, getCommonPayload())
        if (result?.data?.user?.id) {
          updateChatbotDetails({
            showChatbot: true,
            userDetails: result?.data?.user,
          })
          appService.storeUserDetails(result?.data?.user)
        } else {
          throw new Error(result?.data)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])

}

type NewConversationStateT = {
  loading: boolean
  block: BlockT | null
}
export const useNewConversation = () => {
  const { getCommonPayload, updateChatbotDetails } = useChatbot()
  const [state, setState] = useState<NewConversationStateT>({
    loading: false,
    block: null,
  })

  useEffect(() => {
    if (state?.block) {
      callMessage()
    }
  }, [state?.block])

  async function callMessage(url?: string) {
    try {
      if (state?.block?.type === 'attachmentList') {
      } else {
        const response = await backendPost(
          url || apiEndpoints.NEW_CONVERSATION,
          {
            ...getCommonPayload(),
            blocks: JSON.stringify([state?.block]),
            created_at:dayjs().format()
          },
        )
        if (response?.data?.id) {
          updateChatbotDetails({
            chatView: response?.data,
            route: 'chat-view',
          })
        } else {
          //handle error
        }
      }

      handleNewConversationState({ block: null, loading: false })
    } catch (e) {
      console.log(e)
      handleNewConversationState({ block: null, loading: false })
    }
  }
  const handleNewConversationState = (
    payload: Partial<NewConversationStateT>,
  ) => {
    setState((prev) => ({ ...prev, ...payload }))
  }

  return {
    newConversationState: state,
    handleNewConversationState,
  }
}
