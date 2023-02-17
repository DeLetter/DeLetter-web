import { create } from 'zustand'
import { utils, providers } from 'ethers'
import { subscribeWithSelector } from 'zustand/middleware'
import { debounce } from 'lodash-es'
import { WebBundlr } from '@bundlr-network/client'
import { UploadResponse } from '@bundlr-network/client/build/common/types'
import { ONE_ETHER, GOERLI_CHAINID } from '@utils/constants'
import { accountStore } from '@services/Account'

export interface BundlrStore {
  bundlrInstance: WebBundlr | undefined | null
  balance: string
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
    initialBundlr: async () => {
      try {
        const provider = accountStore.getState().provider
        bundlerReady(provider)
      } catch (err) {
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
  }))
)

const bundlerReady = debounce(
  async (provider: providers.Web3Provider | null) => {
    try {
      const bundlr = new WebBundlr(
        'https://devnet.bundlr.network',
        'ethereum',
        provider,
        { providerUrl: 'https://ethereum-goerli-rpc.allthatnode.com' }
      )
      await bundlr.ready()
      bundlrStore.setState({ bundlrInstance: bundlr })
    } catch (err) {
      console.log(err)
      // alert('Failed to initialize Bundlr')
    }
  },
  1000
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
// export const useDisconnect = () => bundlrStore((state) => state.disconnect)

const initialBundlrSub = async () => {
  const { chainId, provider } = accountStore.getState()
  if (provider && chainId === GOERLI_CHAINID) {
    try {
      const initialBundlr = bundlrStore.getState().initialBundlr
      await initialBundlr()
    } catch (err) {
      console.log(err)
      alert('Failed to initialize Bundlr')
    }
  }
}
const fetchBalanceSub = async () => {
  const bundlrInstance = bundlrStore.getState().bundlrInstance
  if (!bundlrInstance) return
  try {
    const fetchBalance = bundlrStore.getState().fetchBalance
    await fetchBalance()
  } catch (err) {
    console.log(err)
    alert('Failed to fetch Bundlr Balance')
  }
}
bundlrStore.subscribe((state) => state.bundlrInstance, fetchBalanceSub, {
  fireImmediately: true,
})

accountStore.subscribe(
  (state) => [state.chainId, state.provider],
  initialBundlrSub,
  { fireImmediately: true }
)
