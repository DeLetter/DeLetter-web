import create from 'zustand'
import { WebBundlr } from '@bundlr-network/client'
import { providers, utils } from 'ethers'

export interface BundlrStore {
  initialBundlr: () => Promise<void> | void,
  bundlrInstance: WebBundlr | undefined | null
  balance: string
  fetchBalance: () => Promise<void> | void
}

export const bundlrStore = create<BundlrStore>((set, get) => ({
  bundlrInstance: null,
  balance: '',
  initialBundlr: async () => {
    try {
      if (!(window as any).ethereum) {
        alert('please install metamask')
      }
      await (window as any).ethereum.enable()
      const provider = new providers.Web3Provider((window as any).ethereum)
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
