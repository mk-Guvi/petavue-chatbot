import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { CircularLoader, H5, Icon, LargeText, SmallText } from '../..'
import { useChatbot } from '@/services/hooks'

import { ChatbotSvg } from '../ChatbotSvg'
import { LANG, apiEndpoints } from '@/constants'
import { backendPost } from '@/integration'
import { NoMessagesPlaceholder } from '../chatbotComponents/components'
import ListItem from './ListItem'

import { arrayToObject } from '@/utils'
import tw from 'tailwind-styled-components'
import Link from 'next/link'
import { ConversationT } from '../Chatbot.types'
import { ChatBotStateT } from '@/redux/slices'
import { useIntersectionObserver } from '@uidotdev/usehooks'

type PageDetailsT = {
  type?: 'pages'
  next?: null | string
  page?: string
  per_page?: number
  total_pages?: number
}
function MessageList() {
  const {
    toggleChat,
    chatbot,
    updateChatbotDetails,
    getCommonPayload,
  } = useChatbot()
  const [loading, setLoading] = useState(false)
  const [targetDivRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: '0px',
  })

  const [conversations, setConverstions] = useState(chatbot?.conversations)
  const [pageDetails, setPageDetails] = useState<PageDetailsT>({})
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [changeListner, setChangeListner] = useState(0)

  useEffect(() => {
    getConversations()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeListner])

  useEffect(() => {
    if (entry?.isIntersecting && !loading) {
      setChangeListner((prev) => prev + 1)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry, loading])

  /**
   * The function `getConversations` is an asynchronous function that retrieves conversations from a
   * backend API and updates the state with the retrieved data.
   */
  const getConversations = async () => {
    try {
      if (!chatbot?.conversations?.length) {
        setLoading(true)
      }
      if (chatbot?.conversations?.length && pageDetails?.next === null) {
        setHasMore(false)
      } else {
        const response = await backendPost(
          pageDetails?.next || apiEndpoints.CONVERSATIONS,
          getCommonPayload(),
        )
        if (response?.data?.conversations?.length) {
          // if (!chatbot?.conversations?.length) {
          //   updateChatbotDetails({
          //     conversations: [...(response?.data?.conversations || [])],
          //   })
          // }

          setConverstions((prev) => {
            const allConversations = [
              ...prev,
              ...(response?.data?.conversations || []),
            ]
            const data = (Object.values(
              arrayToObject(allConversations, 'id'),
            ) as ConversationT[])?.sort((a, b) => {
              if (a?.updated_at && b.updated_at) {
                return b?.updated_at - a?.updated_at
              }
              return 1
            }) //prevents duplicates
            updateChatbotDetails({
              conversations: data?.slice(
                0,
                response?.data?.pages?.per_page || 20,
              ),
            })
            return data
          })

          setPageDetails(response?.data?.pages)
        }
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
      setError(LANG.COMMON.NETWORK_ERROR)
    }
  }

  const addNewConversation = () => {
    let payload: ChatBotStateT = {
      ...chatbot,
      route: 'new-message',
      newConversationState: { ...chatbot?.newConversationState },
    }

    if (!payload?.newConversationState?.defaultMessage) {
      payload['newConversationState']['defaultMessage'] = {
        conversation_parts: [
          {
            blocks: chatbot?.composerSuggestions?.parts?.flat() || [
              {
                type: 'paragraph',
                text: LANG.CHATBOT.DEFAULT_QUESTION,
              },
            ],
            author: chatbot?.composerSuggestions?.operator || {
              name: 'Fin',
              is_bot: true,
            },
          },
        ],
      }
    }
    updateChatbotDetails(payload)
  }

  const interComurl = useMemo(() => {
    return `https://www.intercom.com/intercom-link?user_id=${chatbot?.userDetails?.id}&powered_by_app_id=uudolkfi&company=Dev&solution=live-chat`
  }, [chatbot?.userDetails])

  const onRouteToChatview = useCallback((conversation: ConversationT) => {
    updateChatbotDetails({
      chatView: { conversation, loading: true, hideInputfield: true },
      route: 'chat-view',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Fragment>
      <Header>
        <H5 className="inline-flex flex-1 justify-center items-center">
          Messages
        </H5>
        <Icon
          icon="x"
          className="block sm:hidden ml-auto"
          onClick={toggleChat}
        />
      </Header>

      <section
        className={`flex-1 overflow-auto relative flex flex-col ${
          loading || error ? 'justify-center items-center' : ''
        }`}
      >
        {loading ? (
          <CircularLoader />
        ) : error ? (
          <H5 onClick={getConversations}>{error}</H5>
        ) : conversations?.length ? (
          conversations?.map((eachConversation) => {
            return (
              <ListItem
                conversation={eachConversation}
                key={eachConversation?.id}
                onRouteToChatview={onRouteToChatview}
              />
            )
          })
        ) : (
          <NoMessagesPlaceholder />
        )}
        {hasMore ? <div ref={targetDivRef} className="  p-4  w-full " /> : null}
      </section>

      <AddQuestionContainer onClick={addNewConversation}>
        <SmallText className="font-semibold">
          {LANG.CHATBOT.ASK_A_QUESTION}
        </SmallText>
        <Icon icon="help-circle" className="p-0.5 " />
      </AddQuestionContainer>
      <Link href={interComurl} target="_blank">
        <Footer>
          <ChatbotSvg className="p-1 fill-gray-600" />
          <SmallText>{LANG.CHATBOT.POWERED_BY}</SmallText>
        </Footer>
      </Link>
    </Fragment>
  )
}

export default MessageList
const Footer = tw.footer`p-2 cursor-pointer hover:bg-gray-200 items-center gap-2 bg-gray-100 sm:rounded-b-lg text-gray-600 flex justify-center`
const Header = tw.header`bg-blue-800 sm:rounded-t-xl p-4 flex gap-2  items-center text-white`
const AddQuestionContainer = tw.div`absolute z-20 bottom-16 px-3 rounded-lg text-white left-1/2 transform -translate-x-1/2 bg-blue-700 hover:bg-blue-500 cursor-pointer  inline-flex gap-2 p-2`
