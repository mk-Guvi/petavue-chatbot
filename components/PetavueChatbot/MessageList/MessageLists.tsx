import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { CircularLoader, H5, Icon, LargeText, SmallText } from '../..'
import { useChatbot } from '@/services/hooks'

import { ChatbotSvg } from '../ChatbotSvg'
import { LANG, apiEndpoints } from '@/constants'
import { backendPost } from '@/integration'
import { NoMessagesPlaceholder } from '../components'
import ListItem from './ListItem'

import { arrayToObject } from '@/utils'
import tw from 'tailwind-styled-components'
import Link from 'next/link'

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

  const targetDivRef = useRef<HTMLDivElement | null>(null)
  const [conversations, setConverstions] = useState(chatbot?.conversations)
  const [pageDetails, setPageDetails] = useState<PageDetailsT>({})
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [changeListner, setChangeListner] = useState(0)

  useEffect(() => {
    if (changeListner) {
      getConversations()
    }
    if (!chatbot?.conversations?.length) {
      setLoading(true)
    }
  }, [changeListner])

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null, // The viewport is the root
      rootMargin: '0px',
      threshold: 0.5, // Trigger when 50% of the target is visible
    }

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading) {
          setChangeListner((prev) => prev + 1)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    if (targetDivRef.current) {
      observer.observe(targetDivRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [targetDivRef])

  /**
   * The function `getConversations` is an asynchronous function that retrieves conversations from a
   * backend API and updates the state with the retrieved data.
   */
  const getConversations = async () => {
    try {
      if (chatbot?.conversations?.length && !pageDetails?.next) {
        setHasMore(false)
      } else {
        const response = await backendPost(
          pageDetails?.next || apiEndpoints.CONVERSATIONS,
          getCommonPayload(),
        )
        if (response?.data?.conversations?.length) {
          if (!chatbot?.conversations?.length) {
            updateChatbotDetails({
              conversations: [...(response?.data?.conversations || [])],
            })
          }

          setConverstions((prev) => {
            const allConversations = [
              ...prev,
              ...(response?.data?.conversations || []),
            ]
            return Object.values(arrayToObject(allConversations, 'id')) //prevents duplicates
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
    updateChatbotDetails({ route: 'new-message' })
  }

  const interComurl = useMemo(() => {
    return `https://www.intercom.com/intercom-link?user_id=${chatbot?.userDetails?.id}&powered_by_app_id=uudolkfi&company=Dev&solution=live-chat`
  }, [chatbot?.userDetails])
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
        className={`flex-1 overflow-auto flex flex-col ${
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
              />
            )
          })
        ) : (
          <NoMessagesPlaceholder />
        )}
        {hasMore ? <div ref={targetDivRef} /> : null}
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
