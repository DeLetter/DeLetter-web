import { useEffect } from 'react'
import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { bundlrStore } from '@store/Bundlr'

export default function App({ Component, pageProps }: AppProps) {

  const initialize = async () => {
    const initialBundlr = bundlrStore.getState().initialBundlr
    await initialBundlr();
    const fetchBalance = bundlrStore.getState().fetchBalance
    await fetchBalance()
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <>
      <Head>
        <title>DeLetter</title>
        <meta name="description" content="A decentralized contacts management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}
