import { apiEndpoints } from '@/constants'
import { backendPost } from '@/integration'
import { useGlobalData } from '@/redux/selectors'
import {
  ChatBotStateT,
  ChatViewStateT,
  updateChatbotData,
  updateChatviewState,
} from '@/redux/slices'
import { generateBaseUrl } from '@/utils'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { appService } from '../appService'
import { BlockT, ConversationT } from '@/components/PetavueChatbot/Chatbot.types'
import { uuid } from 'uuidv4'
import dayjs from 'dayjs'
import { OnFormReplayPayloadT, OnQuickReplayPayloadT } from '@/components/PetavueChatbot/Chatview'

export const useChatbot = () => {
  const { chatbot } = useGlobalData()
  const dispatch = useDispatch()

  const updateChatbotDetails = (payload: Partial<ChatBotStateT>) => {
    dispatch(updateChatbotData(payload))
  }

  const onBackToMessages = () => {
    updateChatbotDetails({ route: 'messages' })
  }

  const onUpdateChatviewState = (payload: Partial<ChatViewStateT>) => {
    dispatch(updateChatviewState(payload))
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
      g: "40c6c0be34130c2b978963c60fe3f6b0cbf89595",
      s: "20f13c65-9a9a-4360-9735-a47dbd41ba9c",
      r: "",
      'Idempotency-Key': uuid(),
      referer: generateBaseUrl(),
      client_assigned_uuid: uuid(),
      // user_data: JSON.stringify({
      //   anonymous_id: 'b48b2ba0-54da-4d51-b256-95d19f73c3ff',
      // }),
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
    onUpdateChatviewState,
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

export type CallNewMessagePayloadT = {
  url?: string
  block?: BlockT
  formReplay?:OnFormReplayPayloadT
  callBack?: Function
  ignoreConversationUpdate?: boolean
  quickReplay?: OnQuickReplayPayloadT
}
export const useNewConversation = () => {
  const { getCommonPayload, updateChatbotDetails, chatbot } = useChatbot()
  const [state, setState] = useState<NewConversationStateT>({
    loading: false,
    block: null,
  })
  const checkHideInputField = (data: ConversationT) => {
    const getLastItem =
      data?.conversation_parts?.[data?.conversation_parts?.length - 1]

    return (
      getLastItem?.part_type === 'attribute_collector' &&
      !getLastItem?.form?.attribute_collector_locked
    )
  }
  async function callNewMessage(payload: CallNewMessagePayloadT) {
    const {
      ignoreConversationUpdate,
      url,
      block = state?.block,
      callBack,
      quickReplay,
      formReplay
    } = payload
    try {
      if (block?.type === 'attachmentList') {
        //handle AttachmentList apis
      } else {
        let payload: Record<string, any> = {
          ...getCommonPayload(),
        }
        if (!url) {
          const currentDate = dayjs()
          const formattedDate = currentDate.format(
            'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)',
          )
          payload['created_at'] = formattedDate
          
        }
        if(formReplay){
          payload['form_params'] = JSON.stringify(formReplay)     
        }else if (block) {
          payload['blocks'] = JSON.stringify([block])    
          payload["snapshot_id"]= 29496972
        } else if (quickReplay) {
          payload['conversation_part'] = JSON.stringify({...quickReplay,})
          payload['is_intersection_booted']=null
          payload["client_assigned_uuid"]=uuid()
          payload["platform"]="web"
          payload["internal"]=""
          payload["user_active_company_id"]=-1
        }
        const response = await backendPost(
          url || apiEndpoints.NEW_CONVERSATION,
          payload,
        )

        if (response?.data?.id) {
          updateChatbotDetails({
            chatView: {
              conversation: ignoreConversationUpdate
                ? chatbot?.chatView?.conversation
                : response?.data,
              loading: false,
              hideInputfield: checkHideInputField(response?.data),
              isNewChannel: true,
            },
            route: 'chat-view',
          })
          if (callBack) {
            await callBack()
          }
        } else {
          //handle error
        }
      }

      handleNewConversationState({ loading: false })
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
    callNewMessage,
    checkHideInputField
  }
}
