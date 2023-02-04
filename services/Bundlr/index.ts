import { create } from 'zustand'
import { providers, utils } from 'ethers'
import error from 'next/error'
import { subscribeWithSelector } from 'zustand/middleware'
import { WebBundlr } from '@bundlr-network/client'
import { UploadResponse } from '@bundlr-network/client/build/common/types'
import { ONE_ETHER } from '@utils/constants'
import { switchNetwork } from '@utils/AccountUtils'
// import { debounce } from 'lodash-es';

export interface BundlrStore {
  bundlrInstance: WebBundlr | undefined | null
  balance: string
  account: string
  initialBundlr: () => Promise<void> | void
  fetchBalance: () => Promise<void> | void
  fundBundlr: () => Promise<void> | void
  uploadBundlr: (data: string) => Promise<UploadResponse | undefined>
  // downloadBundlr: (id: string) => Promise<string | undefined> | void
  // disconnect: () => void
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
      } catch (err: unknown | { message: string }) {
        console.log(err)
        alert('Failed to initialize Bundlr')
      }
    },
    fetchBalance: async () => {
      const bundlrInstance = get().bundlrInstance
      //TODO: not sure if this is the right way to do it
      if (!bundlrInstance) throw new Error('Bundlr instance is not initialized')
      try {
        const balance = await bundlrInstance.getLoadedBalance()
        set({ balance: utils.formatEther(balance?.toString() ?? '0') })
      } catch (err) {
        console.log(err)
        throw new Error('Failed to fund Bundlr Balance')
      }
    },
    fundBundlr: async () => {
      const bundlrInstance = get().bundlrInstance
      //TODO: not sure if this is the right way to do it
      if (!bundlrInstance) throw new Error('Bundlr instance is not initialized')
      try {
        let amount = ONE_ETHER.div(10)
        const response = await bundlrInstance?.fund(amount.toString())
        console.log('Wallet funded: ', response)
      } catch (err) {
        console.log(err)
        throw new Error('Failed to fund Bundlr Balance')
      }
    },
    uploadBundlr: async (data: string) => {
      const bundlrInstance = get().bundlrInstance
      //TODO: not sure if this is the right way to do it
      if (!bundlrInstance) throw new Error('Bundlr instance is not initialized')
      try {
        const JSONData = JSON.stringify(data)
        const tx = await bundlrInstance.upload(JSONData, {
          tags: [{ name: 'Content-Type', value: 'application/json' }],
        })
        return tx
      } catch (err) {
        console.log('error for uploadFile', err)
        throw new Error('Failed to upload on Arweave')
      }
    },
    // downloadBundlr:async()=>{

    // }
  }))
)

export const useBundlrInstance = () =>
  bundlrStore((state) => state.bundlrInstance)
export const useBundlrBalance = () => bundlrStore((state) => state.balance)
export const useInitializedBundlr = () =>
  bundlrStore((state) => state.initialBundlr)
export const useFetchBundlrBalance = () =>
  bundlrStore((state) => state.fetchBalance)
export const useFundBundlr = () => bundlrStore((state) => state.fundBundlr)
export const useUploadBundlr = () => bundlrStore((state) => state.uploadBundlr)
//TODO: Move account to another store
export const useAccount = () => bundlrStore((state) => state.account)
// export const useDisconnect = () => bundlrStore((state) => state.disconnect)

// const updateBundlrBalance = async () => {
//   const fetchBalance = bundlrStore.getState().fetchBalance
//   await fetchBalance()
// }
const fetchBalanceSub = async () => {
  const bundlrInstance = bundlrStore.getState().bundlrInstance
  if (!bundlrInstance) return
  const fetchBalance = bundlrStore.getState().fetchBalance
  fetchBalance()
}
bundlrStore.subscribe((state) => state.bundlrInstance, fetchBalanceSub, {
  fireImmediately: true,
})
