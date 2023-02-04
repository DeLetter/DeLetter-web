import error from 'next/error'
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

//TODO: abstract connectWallet from initializeBundlr
//   export const connectWallet = async () => {
//     if (!window?.ethereum) {
//         throw new Error('NoMetamask')
//       }
//     try {
//       const addresses = await window.ethereum.request!({
//         method: 'eth_requestAccounts',
//       })}catch(err){}
//   }