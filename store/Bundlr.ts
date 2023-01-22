import create from 'zustand'
import { WebBundlr } from '@bundlr-network/client'
import { providers, utils } from 'ethers'

export interface BundlrStore {
  initialBundlr: () => Promise<void> | void
  bundlrInstance: WebBundlr | undefined | null
  balance: string
  fetchBalance: () => Promise<void> | void
}

export const bundlrStore = create<BundlrStore>((set, get) => ({
  bundlrInstance: null,
  balance: '',
  initialBundlr: async () => {
    try {
      if (!window?.ethereum) {
        alert('please install metamask')
        return
      }
      await window.ethereum.request!({ method: 'eth_requestAccounts' })
      const provider = new providers.Web3Provider(window.ethereum)
      await provider._ready()
      const bundlr = new WebBundlr(
        'https://devnet.bundlr.network',
        'ethereum',
        provider,
        { providerUrl: 'https://ethereum-goerli-rpc.allthatnode.com' }
      )
      await bundlr.ready()
      set({ bundlrInstance: bundlr })
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }
  },
  fetchBalance: async () => {
    try {
      const bundlr = get().bundlrInstance
      if (bundlr) {
        const balance = await bundlr.getLoadedBalance()
        set({ balance: utils.formatEther(balance?.toString() ?? '0') })
      }
    } catch (err) {
      console.log(err)
      alert('something went wrong')
    }
  },
}))

export const useBundlrInstance = () =>
  bundlrStore((state) => state.bundlrInstance)
export const useBundlrBalance = () => bundlrStore((state) => state.balance)
export const useInitializedBundlr = () =>
  bundlrStore((state) => state.initialBundlr)
export const useFetchBundlrBalance = () =>
  bundlrStore((state) => state.fetchBalance)
