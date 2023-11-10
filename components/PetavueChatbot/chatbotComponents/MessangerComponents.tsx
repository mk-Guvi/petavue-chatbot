import React, { Fragment, useEffect, useRef, useState } from 'react'
import { CircularLoader, H5, Icon, MediumText } from '../..'

import { LargeText, SmallText } from '../..'
import { ChatbotSvg, GifSvg, MessageSvg } from '../ChatbotSvg'
import {
  AttributesT,
  BlockT,
  ConversationT,
  FormT,
  ReplyOptionT,
} from '../Chatbot.types'

import Image from 'next/image'
import { isValidEmail } from '@/utils'
import { OnFormReplayPayloadT, OnQuickReplayPayloadT } from '../Chatview'

const getLabelAndPlaceholder = (attribute: AttributesT, form?: FormT) => {
  if (
    form?.type === 'notification_channel' &&
    attribute?.identifier === 'email'
  ) {
    return {
      label: form?.attribute_collector_locked
        ? 'You will be notified here and by email'
        : 'Get notified by email',
      placeholder: 'email@example.com',
    }
  } else {
    return {
      label: attribute?.name,
      placeholder: `Enter ${attribute?.name}`,
    }
  }
}

type BlockItemRendererT = {
  block?: BlockT
  isBot?: boolean
  containerClassName?: string
  childClassName?: string
  isLoading?: boolean
}
const BlockItemRenderer = (props: BlockItemRendererT) => {
  const {
    block,
    isBot,
    containerClassName = '',
    childClassName = '',
    isLoading,
  } = props
  return (
    <div
      id={block?.uuid}
      className={`p-4  ${containerClassName} ${isLoading ? 'w-28' : ''} ${
        isBot
          ? 'bg-gray-100 mr-auto'
          : `${block?.type !== 'image' ? 'bg-blue-500' : ''} ml-auto text-white`
      } rounded-lg h-fit max-w-[80%] `}
    >
      {isLoading ? (
        <CircularLoader className="mx-auto !h-4 !w-4" />
      ) : block?.type === 'image' ? (
        <Image
          src={block?.url || ''}
          height={200}
          width={200}
          id={block?.uuid}
          alt="img"
          className={`${childClassName}`}
        />
      ) : (
        <SmallText
          className={childClassName}
          id={block?.uuid}
          dangerouslySetInnerHTML={{
            __html: block?.text || block?.content || '',
          }}
        ></SmallText>
      )}
    </div>
  )
}
type BlocksRendererPropsT = {
  blocks: BlockT[]
  isBot: boolean
}
const BlocksRenderer = (props: BlocksRendererPropsT) => {
  const { blocks, isBot } = props
  return (
    <div className="flex flex-col w-full gap-2">
      {blocks?.map((eachBlock, blockIndex) => {
        return (
          <BlockItemRenderer block={eachBlock} key={blockIndex} isBot={isBot} />
        )
      })}
    </div>
  )
}

type AttributeCollectorPropsT = {
  form: FormT
  onFormReplay?: (payload: OnFormReplayPayloadT) => Promise<void>
  id?: string
}

const AttributeCollector = (props: AttributeCollectorPropsT) => {
  const { form, id = '', onFormReplay } = props
  const [state, setState] = useState<FormT>(form)
  const [error, setError] = useState<Record<string, string>>({})
  const [loadingItem, setLoadingItem] = useState('')
  useEffect(() => {
    if (form)
      setState({
        ...form,
        attributes: form?.attributes?.map((e) => {
          const { label, placeholder } = getLabelAndPlaceholder(e, form)
          return {
            ...e,
            name: label,
            placeholder,
          }
        }),
      })
  }, [form])

  const updateValue = (index: number, value: string) => {
    setState((prev: FormT) => {
      let tempAttributes = [...(prev?.attributes || [])]
      tempAttributes[index]['value'] = value
      return {
        ...prev,
        attributes: tempAttributes,
      }
    })
  }

  const onSubmit = async () => {
    let errorObj: Record<string, string> = {}
    let hasError = false
    state?.attributes?.forEach((each) => {
      if (!each?.value) {
        errorObj[`${each?.identifier}`] = 'Enter a value'
        hasError = true
      } else if (each?.identifier === 'email' && !isValidEmail(each?.value)) {
        errorObj[`${each?.identifier}`] = 'Invalid Email'
        hasError = true
      } else {
      }
    })
    setError(errorObj)
    if (!hasError && onFormReplay) {
      setLoadingItem(state?.attributes?.[0]?.identifier || '')
      await onFormReplay({
        conversation_part_id: id,
        identifier: state?.attributes?.[0]?.identifier || '',
        value: state?.attributes?.[0].value || '',
      })
      setLoadingItem('')
    }
  }
  return (
    <div
      className={`p-4
    bg-white
    flex flex-col gap-2
    drop-shadow-lg               
   rounded-lg  mr-auto border-t border-blue-500 flex-1 max-w-[80%] `}
    >
      {state?.attributes?.map((eachAttribute, i) => {
        return (
          <Fragment key={eachAttribute?.name}>
            <label htmlFor={eachAttribute?.identifier}>
              <LargeText>{eachAttribute?.name}</LargeText>
            </label>
            <div
              className={`inline-flex   items-center w-full ${
                form?.attribute_collector_locked
                  ? 'cursor-not-allowed border-2 rounded-md bg-gray-100'
                  : ''
              }`}
            >
              <input
                value={eachAttribute?.value || ''}
                disabled={form?.attribute_collector_locked}
                id={eachAttribute?.identifier}
                placeholder={eachAttribute?.placeholder}
                onChange={(e) => {
                  updateValue(i, e.target.value)
                }}
                className={`h-[2.8rem] flex-1 px-2 outline-none ring-0 ${
                  form?.attribute_collector_locked
                    ? 'cursor-not-allowed'
                    : 'border-l-2  rounded-l-md  border-t-2 border-b-2'
                }`}
              />
              {form?.attribute_collector_locked ? (
                <Icon icon="check" className="text-green-700  mr-2" />
              ) : (
                <button
                  className={`bg-blue-500 h-[2.8rem] ${
                    loadingItem === eachAttribute?.identifier
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  } inline-flex justify-center border-blue-500 border-2 items-center  w-10 rounded-r text-white`}
                  onClick={onSubmit}
                  disabled={loadingItem === eachAttribute?.identifier}
                >
                  {loadingItem === eachAttribute?.identifier ? (
                    <CircularLoader className="!h-4 text-white !w-4" />
                  ) : (
                    <Icon icon="chevron-right" />
                  )}
                </button>
              )}
            </div>
            {error?.[eachAttribute?.identifier] ? (
              <SmallText className="text-red-700 px-2">
                {error?.[eachAttribute?.identifier]}
              </SmallText>
            ) : null}
          </Fragment>
        )
      })}
    </div>
  )
}

const ReplyOptionRenderer = (props: {
  onQuickReplay?: (payload: OnQuickReplayPayloadT) => void
  options: ReplyOptionT[]
  messageId: string
}) => {
  const [showOption, setShowOption] = useState('')
  const onClickOption = (e: any) => {
    const option = props?.options?.find((each) => each?.uuid === e.target.id)

    if (option?.uuid && props?.onQuickReplay) {
      props?.onQuickReplay({
        id: props?.messageId,
        replay_option: { ...option },
      })
      setShowOption(option?.uuid || '')
    }
  }
  return (
    <div
      className="inline-flex justify-end items-center gap-2 w-full flex-wrap "
      onClick={onClickOption}
    >
      {props?.options?.map((e) => {
        return !showOption || showOption === e?.uuid ? (
          <BlockItemRenderer
            block={e}
            key={e?.uuid}
            containerClassName="hover:bg-blue-400 !ml-0 cursor-pointer"
          />
        ) : null
      })}
    </div>
  )
}
type MesaggeRendererPropsT = {
  message: ConversationT
  loading?: boolean
  onFormReplay?: (payload: OnFormReplayPayloadT) => Promise<void>
  onQuickReplay?: (payload: OnQuickReplayPayloadT) => void
}
export const MesaggeRenderer = (props: MesaggeRendererPropsT) => {
  const { loading, message, onFormReplay, onQuickReplay } = props
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (loading && elementRef?.current) {
      elementRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [elementRef, loading])

  return (
    <div className="flex flex-col gap-5" ref={elementRef}>
      {message?.conversation_message ? (
        <div className={` flex gap-3 w-full items-end  `}>
          <ChatbotSvg className="mb-2 h-8 w-8" />

          <BlocksRenderer
            blocks={message?.conversation_message?.blocks || []}
            isBot
          />
        </div>
      ) : null}
      {message?.conversation_parts?.map((eachMessage, i) => {
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
            {!eachMessage?.author?.is_self &&
            eachMessage?.part_type !== 'quick_reply' ? (
              <ChatbotSvg className="mb-2 h-8 w-8 " />
            ) : null}
            {eachMessage?.part_type === 'quick_reply' ? (
              <Fragment>
                {message?.conversation_parts?.[i + 1] ? null : (
                  <ReplyOptionRenderer
                    messageId={eachMessage?.id || ''}
                    options={eachMessage?.reply_options || []}
                    onQuickReplay={onQuickReplay}
                  />
                )}
              </Fragment>
            ) : eachMessage?.part_type === 'attribute_collector' ? (
              <AttributeCollector
                form={eachMessage?.form || {}}
                id={eachMessage?.id}
                onFormReplay={onFormReplay}
              />
            ) : (
              <BlocksRenderer
                blocks={eachMessage?.blocks}
                isBot={!eachMessage?.author?.is_self}
              />
            )}
            {loading ? (
              <CircularLoader className="!h-2.5  !w-2.5 ml-auto" />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export const ChatBotReplyLoader = () => {
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (elementRef?.current) {
      elementRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [elementRef])

  return (
    <div className={` flex gap-5 !w-full items-end  `} ref={elementRef}>
      <ChatbotSvg className="!h-7 !w-7 mb-2" />
      <BlockItemRenderer isBot isLoading />
    </div>
  )
}
