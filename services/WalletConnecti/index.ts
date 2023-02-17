import { create } from 'zustand'
import { providers, utils } from 'ethers'
import error from 'next/error'
import { subscribeWithSelector } from 'zustand/middleware'
import { getProvider } from '@utils/AccountUtils'

export interface WalletConnectStore {
  walletConnectInstance: any
  account: string
  initialWalletConnect: () => Promise<void> | void
  // disconnect: () => void
}

export const walletConnectStore = create(
  subscribeWithSelector<WalletConnectStore>((set, get) => ({
    walletConnectInstance: null,
    account: '',
    initialWalletConnect: async () => {
      console.log('Initializing WalletConnect')
      if (!window?.ethereum) {
        alert('please install metamask')
        return
      }
      const addresses = await window.ethereum.request!({
        method: 'eth_requestAccounts',
      })
      set({ account: addresses[0] })
      const provider = getProvider()
      ;(await provider).getNetwork().then((network) => {
        if (network.chainId !== 5) {
          alert('Please switch to Goerli Test Network')
        }
      })
    },
  }))
)

export const useWalletConnectStore = () =>
  walletConnectStore((state) => state.initialWalletConnect)
export const useAccount = () => walletConnectStore((state) => state.account)
