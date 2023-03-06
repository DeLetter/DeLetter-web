import { ethers } from 'ethers'
import abiJSON from './abi/base.json'
import { BASE_CONTRACT_ADDRESS } from '../constants'
import { Network, Alchemy } from 'alchemy-sdk'
//TODO: Abstract
export const connectContract = async () => {
  const alchemy = new Alchemy({
    apiKey: process.env.NEXT_PUBLIC_PROVIDER_RPC as string,
    network: Network.ETH_GOERLI,
  })
  const contractABI = abiJSON
  // let baseContract: ethers.Contract
  try {
    const { ethereum } = window
    if (!ethereum || ethereum.chainId !== '0x5') {
      throw new Error('Please connect to the Goerli network.')
    }
    const provider = new ethers.providers.Web3Provider(ethereum)
    const provider2 = await alchemy.config.getProvider()
    const signer = provider.getSigner()
    const signer2 = provider2.getSigner()
    console.log('signer', signer)
    console.log('signer2', signer2)

    // baseContract = new ethers.Contract(
    //   BASE_CONTRACT_ADDRESS as string,
    //   contractABI,
    //   signer
    // ) // instantiating new connection to the contract
    const baseContract = new ethers.Contract(
      BASE_CONTRACT_ADDRESS as string,
      contractABI,
      signer
    ) // instantiating new connection to the contract
    return { baseContract, signer }
  } catch (error) {
    console.log('ERROR:', error)
    throw new Error('sorry something went wrong')
  }
}
