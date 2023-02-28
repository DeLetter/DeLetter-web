import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { networkRefresher, useConnect } from '@services/Account'
import Navigation from '@modules/Navigation'
import { ToastRender } from '@components/showToast'
import 'react-quill/dist/quill.snow.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const connect = useConnect()

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        networkRefresher()
      })
      window.ethereum.on('accountsChanged', () => {
        connect()
      })
    }
  }, [connect])

  return (
    <>
      <Head>
        <title>DeLetter</title>
        <meta
          name="description"
          content="A decentralized contacts management tool"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {router.pathname === '/' ? null : <Navigation />}
      <main className="flex flex-col items-center z-[-1]">
        <Component {...pageProps} />
      </main>
      <ToastRender />
    </>
  )
}
