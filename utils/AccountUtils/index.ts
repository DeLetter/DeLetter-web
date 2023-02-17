import error from 'next/error'
import { providers, utils } from 'ethers'

export const getProvider= async () => {
  if (!window?.ethereum) {
    throw new Error('NoMetamask')
  }
  const provider = new providers.Web3Provider(window.ethereum)
  await provider._ready()
  return provider
}

export const switchNetwork = async (chainId: number) => {
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
}
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
