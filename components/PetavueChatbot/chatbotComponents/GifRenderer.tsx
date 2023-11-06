import React, { useEffect, useRef, useState } from 'react'
import { GifSvg } from '../ChatbotSvg'
import ClickAwayListener from 'react-click-away-listener'
import { useChatbot, useDebounce } from '@/services/hooks'
import { BlockT } from '../Chatbot.types'
import { backendPost } from '@/integration'
import { apiEndpoints } from '@/constants'
import { CircularLoader, H5 } from '@/components'
import Image from 'next/image'

interface GifRendererPropsT {
  onSelect: (block: BlockT) => void
  disable?: boolean
}

export function GifRenderer({ onSelect, disable }: GifRendererPropsT) {
  const { getCommonPayload } = useChatbot()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [gifList, setGifList] = useState<BlockT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      callGifs(debouncedSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, open])

  async function callGifs(searchValue: string) {
    try {
      setLoading(true)
      const body = { ...getCommonPayload(), query: searchValue }
      const response = await backendPost(apiEndpoints.GIFS, body)
      if (response?.data?.results) {
        setGifList(response?.data?.results)
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  const toggleOpen = () => {
    if (!disable) {
      setOpen((prev) => !prev)
    }
  }
  const onClickGif = (block: BlockT) => {
    onSelect(block)
    setSearch('')
    setOpen(false)
  }
  return (
    <div className="relative">
      <div onClick={toggleOpen} className="cursor-pointer">
        <GifSvg />
      </div>
      {open ? (
        <ClickAwayListener onClickAway={toggleOpen}>
          <div className="absolute bottom-10 right-2 p-2 flex flex-col gap-2 w-80 h-80 rounded-lg  drop-shadow-2xl z-20 bg-white">
            {/* Your gif content here */}
            <input
              className="outline-0 ring-0 text-sm border-b h-[3rem] w-full px-2"
              placeholder="Search gif"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
            />
            <div
              className={`grid ${
                loading || !gifList?.length
                  ? 'grid-cols-1 place-content-center place-items-center'
                  : 'grid-cols-2'
              }  overflow-auto gap-2 flex-1 px-2`}
            >
              {loading ? (
                <CircularLoader />
              ) : gifList?.length ? (
                gifList?.map((eachGif, i) => {
                  return (
                    <img
                      onClick={() => {
                        onClickGif(eachGif)
                      }}
                      src={eachGif?.previewUrl || ''}
                      alt="gif"
                      key={i}
                      className="h-full w-full"
                    />
                  )
                })
              ) : (
                <H5>No Gifs found</H5>
              )}
            </div>
          </div>
        </ClickAwayListener>
      ) : null}
    </div>
  )
}
