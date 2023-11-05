import { apiEndpoints } from '@/constants'
import { backendPost } from '@/integration'
import { useGlobalData } from '@/redux/selectors'
import { ChatBotStateT, updateChatbotData } from '@/redux/slices'
import { generateBaseUrl } from '@/utils'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { appService } from '../appService'

export const useChatbot = () => {
  const { chatbot } = useGlobalData()
  const dispatch = useDispatch()
  const updateChatbotDetails = (payload: Partial<ChatBotStateT>) => {
    dispatch(updateChatbotData(payload))
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
    const anonymous_id =
      chatbot?.userDetails?.anonymous_id ||
      appService?.getUserDetails()?.anonymous_id
    if (anonymous_id) {
      payload['user_data'] = JSON.stringify({
        anonymous_id,
      })
    }
    return payload
  }
  return {
    chatbot,
    updateChatbotDetails,
    getCommonPayload,
  }
}

export const useChatbotPingService = () => {
  const { getCommonPayload, updateChatbotDetails } = useChatbot()
  useEffect(() => {
    (async () => {
      try {
        const result = await backendPost(apiEndpoints.PING, getCommonPayload())
        if (result?.data?.user?.id) {
          updateChatbotDetails({
            showChatbot: true,
            userDetails: result?.data?.user,
          })
        } else {
          throw new Error(result?.data)
        }
      } catch (error) {
        console.error(error)
      }
    })()
  }, [])
}
