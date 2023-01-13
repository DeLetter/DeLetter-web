import { useCallback, useState } from 'react'
import { bundlrStore } from '@store/Bundlr'
import { getAddress } from 'services/readAreave'

const LoadData: React.FC = () => {
  const [URI, setURI] = useState('')
  const bundlrInstance = bundlrStore.getState().bundlrInstance;

  const getArweaveData = useCallback(async () => {
    const arId = await getAddress()
    if (!arId) { console.log('arId is undefined'); return; }
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

export default LoadData;