import React from 'react'

import { Inter } from 'next/font/google'
import {
  ExtraLargeText,
  ExtraSmallText,
  H1,
  H2,
  H3,
  H4,
  H5,
  LargeText,
  CircularLoader,
  MediumText,
  SmallText,
} from '@/components'

const inter = Inter({ subsets: ['latin'] })

function Components() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <CircularLoader />
      <H1>H1 typo</H1>
      <H2>H2 typo</H2>
      <H3>H3 typo</H3>
      <H4>H4 typo</H4>
      <H5>H5 typo</H5>
      <ExtraLargeText>Extra Large Text</ExtraLargeText>
      <LargeText>Large Text</LargeText>
      <MediumText>Medium Text</MediumText>
      <SmallText>Small Text</SmallText>
      <ExtraSmallText>Extra Small Text</ExtraSmallText>
    </main>
  )
}

export default Components
