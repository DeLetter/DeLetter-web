import { useEffect } from 'react'
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
    <Component {...pageProps} />
  )
}
