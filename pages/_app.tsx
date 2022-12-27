// import '../styles/globals.css'
import { useState, useRef, useCallback, useEffect } from 'react'
import { WebBundlr } from "@bundlr-network/client"
import { providers, utils } from 'ethers'
import '../output.css'
import type { AppProps } from 'next/app'
import { MainContext } from '@utils/context'

export default function App({ Component, pageProps }: AppProps) {
  const [bundlrInstance, setBundlrInstance] = useState<WebBundlr | null>()
  const [balance, setBalance] = useState<string>('')
  const bundlrRef = useRef<WebBundlr | null>()

  const initialBundlr = useCallback(async () => {
    try {
      if (!(window as any).ethereum) {
        alert('please install metamask')
      }
      await (window as any).ethereum.enable()
      const provider = new providers.Web3Provider((window as any).ethereum);
      await provider._ready()
      const bundlr = new WebBundlr("https://devnet.bundlr.network", "ethereum", provider, { providerUrl: process.env.PROVIDER_RPC })
      await bundlr.ready()

      setBundlrInstance(bundlr)
      bundlrRef.current = bundlr
    } catch (err) {
      console.log('error for initialize bundlr', err)
      alert('something went wrong')
    }

  }, [])

  const fetchBalance = useCallback(async () => {
    const bal = await bundlrRef.current?.getLoadedBalance()
    console.log('bal: ', utils.formatEther(bal?.toString() ?? '0'))
    setBalance(utils.formatEther(bal?.toString() ?? '0'))
  }, [])

  useEffect(() => {
    initialBundlr();
    fetchBalance();
  }, [])

  return (
    <MainContext.Provider value={{
      initialBundlr,
      bundlrInstance,
      balance,
      fetchBalance
    }}>
      <Component {...pageProps} />
    </ MainContext.Provider>
  )
}
