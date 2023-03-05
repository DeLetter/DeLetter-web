import { ethers } from 'ethers'
import { EventEmitter } from 'stream'

//TODO: temperary solution, change provider type
interface TEthereumProvider
  extends ethers.providers.ExternalProvider,
    EventEmitter {
  chainId: string
}
declare global {
  interface Window {
    ethereum: TEthereumProvider | undefined
  }
}
