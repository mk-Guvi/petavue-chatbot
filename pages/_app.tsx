import { ChatBot } from '@/components'
import store from '@/redux/store'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment } from 'react'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Provider store={store}>
        <Component {...pageProps} />
        <ChatBot />
      </Provider>
    </Fragment>
  )
}
