import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { providers } from 'ethers'
import error from 'next/error'

export interface AccountStore {
  account: string
  chainId: number
  provider: providers.Web3Provider | null
  connect: () => Promise<void> | void
  switchNetwork: (chainId: number) => Promise<void> | void
}

export const accountStore = create(
  subscribeWithSelector<AccountStore>((set) => ({
    account: '',
    chainId: NaN,
    provider: null,
    connect: async () => {
      try {
        if (!window?.ethereum) {
          alert('Please install metamask')
          return
        }
        const provider = new providers.Web3Provider(window.ethereum)
        await provider._ready()
        const addresses = await window.ethereum.request!({
          method: 'eth_requestAccounts',
        })
        const chainId = await provider.getNetwork()
        set({
          account: addresses[0],
          chainId: chainId.chainId,
          provider: provider,
        })
      } catch (err: unknown | { message: string }) {
        console.log(err)
        alert('Failed to connect to wallet')
      }
    },
    switchNetwork: async (chainId: number) => {
      try {
        await window.ethereum!.request!({
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
    },
  }))
)

export const useAccount = () => accountStore((state) => state.account)
export const useProvider = () => accountStore((state) => state.provider)
export const useChainId = () => accountStore((state) => state.chainId)
export const useConnect = () => accountStore((state) => state.connect)
export const useSwitchNetwork = () =>
  accountStore((state) => state.switchNetwork)

export const networkRefresher = async () => {
  if (!window?.ethereum) {
    alert('Please install metamask')
    return
  }
  try {
    const provider = new providers.Web3Provider(window.ethereum)
    await provider._ready()
    const chainId = await provider.getNetwork()
    accountStore.setState({ provider: provider, chainId: chainId.chainId })
  } catch (err) {
    console.log(err)
    alert('Failed to update network')
  }
}
