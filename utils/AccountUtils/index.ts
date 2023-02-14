import error from 'next/error'
export const switchNetwork = async (chainId: number) => {
  try {
    await (window.ethereum as any).request({
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

//TODO: abstract connectWallet from initializeBundlr
export const connectWallet = async () => {
  const isMetaMaskInstalled =
    typeof window !== 'undefined' && (window.ethereum as any)?.isMetaMask

  if (!isMetaMaskInstalled) {
    console.log('Please install MetaMask to use this dApp!')
    return
  }
  try {
    const accounts = await (window.ethereum as any).request({
      method: 'eth_requestAccounts',
    })
    return accounts[0]
  } catch (error: any) {
    console.log(error)
  }
}
