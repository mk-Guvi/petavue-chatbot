import React, { useMemo } from 'react'
import { BlockT, ConversationT } from '../Chatbot.types'
import { ChatbotSvg } from '../ChatbotSvg'
import { ExtraSmallText, Icon, SmallText } from '@/components'
import Image from 'next/image'
import { getLastSeen } from '@/utils'
import tw from 'tailwind-styled-components'

type ListItemPropT = {
  conversation: ConversationT
}

const htmlRegex = /<[^>]+>/g
function ListItem({ conversation }: ListItemPropT) {
  const { value } = useMemo(() => {
    return getValue()
  }, [conversation.id])

  /**
   * The function `getValue` returns a value based on the type of conversation part and the data in the
   * conversation.
   * @returns an object with a `value` property.
   */
  function getValue(): { value: string } {
    const partType = conversation?.conversation_parts?.[0]?.part_type

    if (partType === 'attribute_collector') {
      return {
        value: `Asked for ${conversation?.conversation_parts?.[0]?.form?.attributes?.[0]?.name}`,
      }
    } else {
      const blocks = conversation?.conversation_parts?.[0]?.blocks || []

      const data = blocks?.length ? blocks?.[0] : null

      return {
        value: data
          ? getValueFromBlocks(data)
          : getValueFromBlocks(conversation?.conversation_message?.blocks?.[0]),
      }
    }
  }

  function getValueFromBlocks(block: BlockT) {
    return block?.type === 'html'
      ? block?.content?.replace(htmlRegex, '') || ''
      : block?.text || ''
  }

  return (
    <ListContainer>
      <Image
        src="https://static.intercomassets.com/assets/default-avatars/fin/128-6a5eabbb84cc2b038b2afc6698ca0a974faf7adc9ea9f0fb3c3e78ac12543bc5.png"
        alt="Fin profile"
        width={40}
        height={40}
      />
      <MessageContainer>
        <SmallText
          className={`truncate  overflow-clip  ${
            conversation?.read ? '' : 'font-semibold  group-hover:text-blue-600'
          }`}
        >
          {value}
        </SmallText>
        <MessageMetadataContainer>
          <ExtraSmallText>
            {conversation?.last_participating_admin?.first_name}
          </ExtraSmallText>
          <SecondaryIndicator />
          <ExtraSmallText>
            {getLastSeen(conversation?.updated_at)}
          </ExtraSmallText>
        </MessageMetadataContainer>
      </MessageContainer>

      <div className="w-6 inline-flex justify-center">
        {conversation?.read ? (
          <Icon icon="chevron-right" />
        ) : (
          <UnseenIndicator />
        )}
      </div>
    </ListContainer>
  )
}

export default ListItem

const ListContainer = tw.div`group hover:bg-blue-100 transition-all duration-200 cursor-pointer border-b flex items-center gap-3 py-6 px-3`
const MessageContainer = tw.div`inline-flex flex-1 sm:max-w-[78%] w-[79%] flex-col overflow-clip gap-1`
const SecondaryIndicator = tw.div`h-1.5 w-1.5 rounded-full bg-gray-300`
const UnseenIndicator = tw.div`h-2 w-2 rounded-full bg-orange-400 `
const MessageMetadataContainer = tw.div`inline-flex overflow-clip text-gray-600 items-center gap-2`
