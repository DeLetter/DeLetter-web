import { bundlrStore } from '@store/Bundlr'
import { connectContract } from '@utils/contracts'

export const getAddress = async () => {
  const bundlrInstance = bundlrStore.getState().bundlrInstance;
  if (!bundlrInstance) { console.log('bundlrInstance is undefined'); return; };
  try {
    const { baseContract } = await connectContract();
    const res = await baseContract.functions._addressList(bundlrInstance.address);
    const arId: string | undefined = res.arweaveAddress;
    return arId;
  } catch (err) {
    console.log('read contract', err)
    throw new Error('Failed to read contract')
  }
}