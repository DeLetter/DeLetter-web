import { ethers } from 'ethers'

//TODO: CHANGE PROVIDER
interface TEthereumProvider extends ethers.providers.ExternalProvider {
  chainId: string
}
declare global {
  interface Window {
    ethereum: TEthereumProvider | undefined
  }
}
