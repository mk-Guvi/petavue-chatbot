import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { H5, Icon, MediumText } from '../..'
import { useChatbot } from '@/services/hooks'
import { LANG } from '@/constants'
import { LargeText, SmallText } from '../..'
import { ChatbotSvg, GifSvg, MessageSvg } from '../ChatbotSvg'
import { BlockT, ConversationT } from '../Chatbot.types'
import Link from 'next/link'
import tw from 'tailwind-styled-components'
import Image from 'next/image'
import { ChatBotStateT } from '@/redux/slices'

export const NoMessagesPlaceholder = () => {
  return (
    <div className=" justify-center m-auto items-center flex flex-col gap-2">
      <MessageSvg />
      <LargeText>{LANG.CHATBOT.NO_MESSAGES}</LargeText>
      <SmallText>{LANG.CHATBOT.MESSAGES_FROM_TEAM}</SmallText>
    </div>
  )
}

export const ChatBotIcon = () => {
  const { chatbot, toggleChat } = useChatbot()

  return (
    <div
      className={`fixed  ${
        chatbot?.open ? 'hidden' : ''
      }  h-12 w-12   text-white sm:flex place-items-center  rounded-full drop-shadow-lg hover:scale-110 transition-all duration-200 bg-blue-500 z-50 bottom-6 right-6 transform ${
        chatbot.open ? 'rotate-180 ' : ''
      } p-3`}
      onClick={toggleChat}
    >
      {chatbot.open ? (
        <Icon icon="chevron-up" className="h-full w-full m-auto" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 32">
          <path
            className="fill-white"
            d="M28 32s-4.714-1.855-8.527-3.34H3.437C1.54 28.66 0 27.026 0 25.013V3.644C0 1.633 1.54 0 3.437 0h21.125c1.898 0 3.437 1.632 3.437 3.645v18.404H28V32zm-4.139-11.982a.88.88 0 00-1.292-.105c-.03.026-3.015 2.681-8.57 2.681-5.486 0-8.517-2.636-8.571-2.684a.88.88.105 00-1.29.107 1.01 1.01 0 00-.219.708.992.992 0 00.318.664c.142.128 3.537 3.15 9.762 3.15 6.226 0 9.621-3.022 9.763-3.15a.992.992 0 00.317-.664 1.01 1.01 0 00-.218-.707z"
          ></path>
        </svg>
      )}
    </div>
  )
}

type BlocksRendererPropsT = {
  blocks: BlockT[]
}
const BlocksRenderer = (props: BlocksRendererPropsT) => {
  const { blocks } = props
  return blocks?.map((eachBlock, blockIndex) => {
    return eachBlock?.type === 'html' ? (
      <div
        key={blockIndex}
        dangerouslySetInnerHTML={{ __html: eachBlock?.content || '' }}
      />
    ) : eachBlock?.type === 'image' ? (
      <Image
        src={eachBlock?.url || ''}
        height={200}
        width={200}
        alt="img"
        key={blockIndex}
      />
    ) : (
      <SmallText key={blockIndex}>{eachBlock?.text}</SmallText>
    )
  })
}
type MesaggeRendererPropsT = {
  message: ConversationT
}
export const MesaggeRenderer = (props: MesaggeRendererPropsT) => {
  const { message } = props
  console.log(message, 'dasd')
  return (
    <div className="flex flex-col gap-5">
      {message?.conversation_message ? (
        <div className={` flex gap-3 w-full items-end   `}>
          <ChatbotSvg className="mb-2 h-8 w-8" />
          <div
            className={`p-4   bg-gray-100  rounded-lg h-fit max-w-[80%] mr-auto `}
          >
            <BlocksRenderer
              blocks={message?.conversation_message?.blocks || []}
            />
          </div>
        </div>
      ) : null}
      {message?.conversation_parts?.map((eachMessage, i) => {
        console.log({ eachMessage }, 'sdas')
        return (
          <div
            key={i}
            className={` flex gap-3  items-end  ${
              eachMessage?.part_type === 'attribute_collector' ||
              eachMessage?.author?.is_self
                ? 'justify-end '
                : 'justify-start'
            }`}
          >
            {!eachMessage?.author?.is_self ? (
              <ChatbotSvg className="mb-2 h-8 w-8 " />
            ) : null}
            {eachMessage?.part_type === 'attribute_collector' ? (
              <div
                className={`p-4
                bg-white
                drop-shadow-lg               
               rounded-lg h-40 mr-auto border-t border-blue-500 flex-1 max-w-[80%] `}
              ></div>
            ) : (
              <div
                className={`p-4  ${
                  !eachMessage?.author?.is_self
                    ? 'bg-gray-100 mr-auto'
                    : 'bg-blue-500 ml-auto text-white'
                } rounded-lg h-fit max-w-[80%] `}
              >
                <BlocksRenderer blocks={eachMessage?.blocks} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export const IntercomLabel = () => {
  const { chatbot } = useChatbot()
  const interComurl = useMemo(() => {
    return `https://www.intercom.com/intercom-link?user_id=${chatbot?.userDetails?.id}&powered_by_app_id=uudolkfi&company=Dev&solution=live-chat`
  }, [chatbot?.userDetails])

  return (
    <Link href={interComurl} target="_blank">
      <IntercomLabelContainer>
        <ChatbotSvg className="p-1 fill-gray-600" />
        <SmallText>{LANG.CHATBOT.POWERED_BY}</SmallText>
      </IntercomLabelContainer>
    </Link>
  )
}

const IntercomLabelContainer = tw.div`flex mx-auto items-center gap-2 p-1.5 text-gray-600 rounded-2xl px-3 hover:bg-gray-100 transition-all duration-200 cursor-pointer w-fit`

type ChatHeaderPropsT = {
  isDetailedView?: boolean
  allowToggle?: boolean
}

export const CoversationHeader = ({ chatbot }: { chatbot: ChatBotStateT }) => {
  return (
    <div className="flex w-full items-center transition-all duration-200 hover:bg-gray-100 gap-3 rounded-lg cursor-pointer  ">
      <Image
        src="https://static.intercomassets.com/assets/default-avatars/fin/128-6a5eabbb84cc2b038b2afc6698ca0a974faf7adc9ea9f0fb3c3e78ac12543bc5.png"
        alt="Fin profile"
        width={40}
        height={40}
      />
      <div className="flex flex-col justify-start items-start">
        <MediumText>
          {chatbot?.composerSuggestions?.operator?.first_name || 'Fin'}
        </MediumText>
        <MediumText className="inline-flex items-center gap-1">
          <span className="bg-gray-500 px-1 py-0 text-[0.6rem] text-white rounded-md">
            AI
          </span>
          {'Bot'}
        </MediumText>
      </div>
    </div>
  )
}
export const ChatHeader = (props: ChatHeaderPropsT) => {
  const { chatbot, onBackToMessages, toggleChat } = useChatbot()
  const { allowToggle, isDetailedView } = props
  const [showDetailedView, setShowDetailedView] = useState(isDetailedView)
  const toggleView = () => {
    setShowDetailedView((prev) => !prev)
  }
  return (
    <div className="py-2 border-b">
      <Header>
        <ActionIcon icon="chevron-left" onClick={onBackToMessages} />
        {showDetailedView ? (
          <H5 className="inline-flex flex-1 justify-center items-center">
            {chatbot?.composerSuggestions?.operator?.first_name || 'Fin'}
          </H5>
        ) : null}
        {!showDetailedView ? (
          <button
            disabled={!allowToggle}
            onClick={toggleView}
            className={`flex flex-col flex-1 items-center w-full gap-3 p-3 ${
              allowToggle ? 'hover:bg-gray-100 rounded-lg' : ''
            }`}
          >
            <CoversationHeader chatbot={chatbot} />
          </button>
        ) : null}

        <ActionIcon
          icon="x"
          className="sm:invisible visible"
          onClick={toggleChat}
        />
      </Header>
      {showDetailedView ? (
        <div
          className={`flex flex-col px-2  transition-all duration-200 gap-3  `}
        >
          <button
            disabled={!allowToggle}
            onClick={toggleView}
            className={`flex flex-col flex-1 items-center w-full gap-3 p-3 ${
              allowToggle ? 'hover:bg-gray-100 rounded-lg' : ''
            }`}
          >
            <Image
              src="https://static.intercomassets.com/assets/default-avatars/fin/128-6a5eabbb84cc2b038b2afc6698ca0a974faf7adc9ea9f0fb3c3e78ac12543bc5.png"
              alt="Fin profile"
              width={50}
              height={50}
            />
            <MediumText>
              {chatbot?.newConversation?.home_card?.text ||
                LANG.CHATBOT.ASK_A_QUESTION}
            </MediumText>
            <div className="inline-flex gap-2 items-center">
              <Icon icon="alert-circle" />
              <SmallText>
                {chatbot?.newConversation?.home_card?.subtitle ||
                  LANG.CHATBOT.TEAM_CAN_HELP}
              </SmallText>
            </div>
          </button>
        </div>
      ) : null}
    </div>
  )
}

const Header = tw.header`flex   px-1.5`
const ActionIcon = tw(
  Icon,
)` text-blue-600 hover:bg-blue-100 p-3 !h-14 cursor-pointer !w-14 rounded-2xl transition-all duration-300`
