import Head from 'next/head'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'

export default function App({ Component, pageProps }: AppProps) {

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
      <main className='flex flex-col items-center'>
        <Component {...pageProps} />
      </main>
    </>
  )
}
