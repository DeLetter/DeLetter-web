import { ethers } from 'ethers'
import abiJSON from './abi/base.json'
import { BASE_CONTRACT_ADDRESS } from '../constants'
import { fetchApi } from '@utils/fetch/fetchApi'
const { Alchemy, Network, Wallet, Utils } = require('alchemy-sdk')

const settings = {
  apiKey: process.env.NEXT_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI, // Replace with your network.
}

const alchemy = new Alchemy(settings)

//TODO: Abstract
export const connectContract = async () => {
  const contractABI = abiJSON
  try {
    const { ethereum } = window
    if (!ethereum || ethereum.chainId !== '0x5') {
      throw new Error('Please connect to the Goerli network.')
    }
    const privateKey = await fetchApi({
      path: 'configInfo',
      method: 'GET',
    })
    const etherProvider = await alchemy.config.getProvider()
    const wallet = new Wallet(privateKey.configInfo, etherProvider)
    const baseContract = new ethers.Contract(
      BASE_CONTRACT_ADDRESS as string,
      contractABI,
      wallet
    ) // instantiating new connection to the contract
    return { baseContract, wallet }
  } catch (error) {
    console.log('ERROR:', error)
    throw new Error('sorry something went wrong')
  }
}
