import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { BlockT } from '../Chatbot.types'
import { GifRenderer } from './GifRenderer'
import { Icon } from '@/components'
import { LANG } from '@/constants'

type ChatbotInputfieldPropsT = {
  disabled?: boolean
  onEnter: (block: BlockT) => void
}
export const ChatbotInputfield = (props: ChatbotInputfieldPropsT) => {
  const { onEnter, disabled } = props
  const inputElementRef = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState('')

  const clearAll = () => {
    setValue('')
  }

  const onSubmit = useCallback(() => {
    if (!disabled && value) {
      onEnter({
        type: 'paragraph',
        text: value,
      })
      clearAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onSubmit()
      }
    }

    if (inputElementRef?.current) {
      inputElementRef.current.focus()
      window.addEventListener('keydown', handleKeyDown)
    }

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      if (inputElementRef) {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputElementRef, onSubmit])

  return (
    <div className="h-[4rem] sm:h-[3.5rem] items-center px-4 sm:rounded-b-lg group border-t flex gap-3 bg-gray-50 w-full">
      <input
        id={'submit'}
        disabled={disabled}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        placeholder={LANG.CHATBOT.ASK_A_QUESTION}
        ref={inputElementRef}
        autoComplete={'new-password'}
        value={value || ''}
        className="flex-1 h-full bg-transparent outline-none border-0 px-4 ring-0"
      />
      {value ? (
        <Icon
          icon="send"
          className="text-blue-500 cursor-pointer"
          onClick={onSubmit}
        />
      ) : (
        <Fragment>
          <GifRenderer onSelect={onEnter} disable={disabled} />
        </Fragment>
      )}
    </div>
  )
}
