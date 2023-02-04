import { bundlrStore } from '@services/Bundlr'
import { connectContract } from '@utils/contracts'

export const getAddress = async () => {
  const address = bundlrStore.getState().account
  if (!address) {
    console.log('no address')
    return
  }
  try {
    const { baseContract } = await connectContract()
    const res = await baseContract.functions._addressList(address)
    console.log('calling arweaveAddress')
    const arId: string | undefined = res.arweaveAddress
    return arId
  } catch (err) {
    console.log('read contract', err)
    throw new Error('Failed to read contract')
  }
}
