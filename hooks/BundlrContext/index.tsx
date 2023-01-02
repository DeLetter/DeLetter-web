//TODO: This is a temparary file, it'll be deleted
import { useState, useEffect, useCallback, useRef, createContext, useContext, ReactNode } from 'react'
import { WebBundlr } from "@bundlr-network/client"
import { providers, utils } from 'ethers'

export interface IBundlrContext {
  initialBundlr: () => Promise<void> | void,
  bundlrInstance: WebBundlr | undefined | null,
  balance: string,
  fetchBalance: () => Promise<void> | void
}

const BundlrContextDefault = {
  initialBundlr: () => { },
  bundlrInstance: undefined,
  balance: '',
  fetchBalance: () => { }
}
export const BundlrContext = createContext<IBundlrContext>(BundlrContextDefault)

interface IBundlrContextProviderProps {
  children: ReactNode
}
const BundlrContextProvider: React.FC<IBundlrContextProviderProps> = ({ children }) => {
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
      const bundlr = new WebBundlr("https://devnet.bundlr.network", "ethereum", provider, { providerUrl: "https://ethereum-goerli-rpc.allthatnode.com" })
      await bundlr.ready()

      setBundlrInstance(bundlr)
      bundlrRef.current = bundlr
      fetchBalance()
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }

  }, [])

  const fetchBalance = useCallback(async () => {
    const bal = await bundlrRef.current?.getLoadedBalance()
    setBalance(utils.formatEther(bal?.toString() ?? '0'))
  }, [])

  useEffect(() => {
    initialBundlr();
    fetchBalance();
  }, [])

  return (
    <BundlrContext.Provider value={{
      initialBundlr,
      bundlrInstance,
      balance,
      fetchBalance
    }}>
      {children}
    </ BundlrContext.Provider>
  )
}

export default BundlrContextProvider;

export const useBundlr = () => {
  const { bundlrInstance, balance, fetchBalance } = useContext(BundlrContext)
  return { bundlrInstance, balance, fetchBalance }
}