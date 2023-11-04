import { BrowserHeader } from '@/components'
import { H1 } from '@/components/Typography'
import React, { Fragment } from 'react'

function Home() {
  return (
    <Fragment>
      <BrowserHeader title="Home" />
      <div className="h-screen w-screen flex justify-center items-center p-24">
        <H1>Home</H1>
      </div>
    </Fragment>
  )
}

export default Home
