import { useCallback, useState } from 'react'
import { useBundlr } from '@hooks/BundlrContext'
import { connectContract } from '@utils/contracts'

const ReadArButton: React.FC = () => {
  const [URI, setURI] = useState('')
  const { bundlrInstance } = useBundlr();

  const getAddress = useCallback(async () => {
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
  }, [bundlrInstance])

  const getArweaveData = useCallback(async () => {
    const arId = await getAddress()
    if(!arId) { console.log('arId is undefined'); return; }
    setURI(`https://arweave.net/${arId}`)
  }, [bundlrInstance])
  return (
    <>
      <button className="mt-4 border-2 border-black" onClick={getArweaveData}>
        Load data from arweave
      </button>
      {URI && <a href={URI} target="_blank" >{URI}</a>}
    </>
  )
}

export default ReadArButton;