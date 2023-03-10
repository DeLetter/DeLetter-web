import { ethers } from 'ethers'
import abiJSON from './abi/base.json'
import { BASE_CONTRACT_ADDRESS } from '../constants'

//TODO: Abstract
export const connectContract = async () => {
  const contractABI = abiJSON
  let baseContract: ethers.Contract
  try {
    const { ethereum } = window
    if (!ethereum || ethereum.chainId !== '0x5') {
      throw new Error('Please connect to the Goerli network.')
    }
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    baseContract = new ethers.Contract(
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
