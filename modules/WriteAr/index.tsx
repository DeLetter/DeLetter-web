import { useCallback } from 'react'
import { bundlrStore } from '@store/Bundlr';
import { emailDataStore } from '@store/EmailData';
import { connectContract } from '@utils/contracts'
import { UploadResponse } from '@bundlr-network/client/build/common/types'

//Store on Arweave and write related data on blockchain
const WriteAr: React.FC = () => {
  const encryptedData = emailDataStore.getState().encryptedData

  const bundlrInstance = bundlrStore.getState().bundlrInstance;

  const uploadFile = useCallback(
    async (data: string) => {
      try {
        const JSONData = JSON.stringify(data)
        const tx = await bundlrInstance?.upload(JSONData, {
          tags: [{ name: 'Content-Type', value: 'application/json' }],
        })
        return tx
      } catch (err) {
        console.log('error for uploadFile', err)
        throw new Error('error for uploadFile')
      }
    },
    [bundlrInstance]
  )

  const writeArweaveAdd = useCallback(
    async (bundlrTx: UploadResponse | undefined) => {
      if (!bundlrTx) {
        console.log('bundlrTx is undefined')
        return
      }
      try {
        const { id } = bundlrTx
        const { baseContract } = await connectContract()
        const tx = await baseContract.functions.setArweaveAddress(id)
        return tx
      } catch (err) {
        console.log('SetArweaveAddress', err)
        throw new Error('SetArweaveAddress')
      }
    },
    [bundlrInstance]
  )

  const handleSubmit = useCallback((async (encryptedData: string) => {
    try {
      const tx = await uploadFile(encryptedData)
      console.log(tx)
      const ftx = await writeArweaveAdd(tx)
      console.log('ftx', ftx)
      alert(`sucessfully stored on arweave and blockchain, hash: ${ftx.hash}`)
    } catch (err) {
      alert('something went wrong')
    }
  }), [bundlrInstance, encryptedData])
  // TODO: add error notification
  return (
    <div >
      <h2>Encrypt Your Email lists !</h2>
      <button
        onClick={() => handleSubmit(encryptedData)}
        className="mt-4 border-2 p-2 border-black"
      >
        Store the encrypted data on Arweave !
      </button>
    </div>
  )
}

export default WriteAr
