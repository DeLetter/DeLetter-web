import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { providers } from 'ethers'

export interface AccountStore {
  account: string
  chainId: number
  provider: providers.Web3Provider | null
  connect: () => Promise<void> | void
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
      } catch (err) {
        console.log(err)
        alert('Failed to connect to wallet')
      }
    },
  }))
)

export const useAccount = () => accountStore((state) => state.account)
export const useProvider = () => accountStore((state) => state.provider)
export const useChainId = () => accountStore((state) => state.chainId)
export const useConnect = () => accountStore((state) => state.connect)

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
