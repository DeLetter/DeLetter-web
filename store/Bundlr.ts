import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { WebBundlr } from '@bundlr-network/client'
import { providers, utils } from 'ethers'
import error from 'next/error'
// import { debounce } from 'lodash-es';

export interface BundlrStore {
  initialBundlr: () => Promise<void> | void
  bundlrInstance: WebBundlr | undefined | null
  balance: string
  account: string
  fetchBalance: () => Promise<void> | void
  // disconnect: () => void
}

export const switchNetwork = async (chainId: number) => {
  try {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    })
  } catch (switchError: error | any) {
    if (switchError.code === 4902) {
      console.log(
        'This network is not available in your metamask, please add it'
      )
    }
    console.log('Failed to switch to the network')
  }
}

export const bundlrStore = create(
  subscribeWithSelector<BundlrStore>((set, get) => ({
    bundlrInstance: null,
    balance: '',
    account: '',
    initialBundlr: async () => {
      try {
        if (!window?.ethereum) {
          alert('please install metamask')
          return
        }
        const addresses = await window.ethereum.request!({
          method: 'eth_requestAccounts',
        })
        //TODO: seperate account and bundlr storage, they're not supposed to be the same storage
        set({ account: addresses[0] })
        const provider = new providers.Web3Provider(window.ethereum)
        await provider._ready()
        const chainId = await provider.getNetwork()
        if (chainId.chainId != 5) {
          await switchNetwork(5)
          return
        }
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
)

export const useBundlrInstance = () =>
  bundlrStore((state) => state.bundlrInstance)
export const useBundlrBalance = () => bundlrStore((state) => state.balance)
export const useInitializedBundlr = () =>
  bundlrStore((state) => state.initialBundlr)
export const useFetchBundlrBalance = () =>
  bundlrStore((state) => state.fetchBalance)
export const useAccount = () => bundlrStore((state) => state.account)
// export const useDisconnect = () => bundlrStore((state) => state.disconnect)

// const updateBundlrBalance = async () => {
//   const fetchBalance = bundlrStore.getState().fetchBalance
//   await fetchBalance()
// }
bundlrStore.subscribe(
  (state) => state.bundlrInstance,
  bundlrStore.getState().fetchBalance,
  { fireImmediately: true }
)
