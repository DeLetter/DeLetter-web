import '../styles/globals.css'
// import { useState, useRef, useCallback, useEffect } from 'react'
// import { WebBundlr } from "@bundlr-network/client"
// import { providers, utils } from 'ethers'
// import '../output.css'
import type { AppProps } from 'next/app'
import MainContextProvider from '@hooks/MainContext'

export default function App({ Component, pageProps }: AppProps) {

  return (
    <MainContextProvider>
      <Component {...pageProps} />
    </MainContextProvider>
  )
}
