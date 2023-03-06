import { ethers } from 'ethers'
import abiJSON from './abi/base.json'
import { BASE_CONTRACT_ADDRESS } from '../constants'
import { fetchApi } from '@utils/fetch/fetchApi'
import { Alchemy, AlchemyProvider, Network, Wallet } from 'alchemy-sdk'

//TODO: Abstract
export const connectContract = async () => {
  const contractABI = abiJSON
  try {
    const { ethereum } = window
    if (!ethereum || ethereum.chainId !== '0x5') {
      throw new Error('Please connect to the Goerli network.')
    }
    const { privateKey, rpc } = await fetchApi({
      path: 'configInfo',
      method: 'GET',
    })

    const settings = {
      apiKey: rpc,
      network: Network.ETH_GOERLI, // Replace with your network.
    }
    const alchemy = new Alchemy(settings)
    const etherProvider = await alchemy.config.getProvider()
    const wallet = new Wallet(privateKey, etherProvider)
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
