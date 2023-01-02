import { useCallback, useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useBundlr } from '@hooks/BundlrContext'
import { Email } from 'types/email.interface'
import { connectContract } from '@utils/contracts'
import { UploadResponse } from '@bundlr-network/client/build/common/types'

//Store on Arweave and write related data on blockchain
const WriteArButton: React.FC = () => {
  // const [URI, setURI] = useState('')
  const { bundlrInstance } = useBundlr()

  const uploadFile = useCallback(async (data: Email) => {
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
  }, [bundlrInstance])

  const writeArweaveAdd = useCallback(async (bundlrTx: UploadResponse | undefined) => {
    if (!bundlrTx) { console.log('bundlrTx is undefined'); return }
    try {
      const { id } = bundlrTx;
      const { baseContract } = await connectContract();
      const tx = await baseContract.functions.setArweaveAddress(id);
      return tx
    } catch (err) {
      console.log('SetArweaveAddress', err)
      throw new Error('SetArweaveAddress')
    }

  }, [bundlrInstance])

  const makeArweave = async (data: Email) => {
    try {
      const tx = await uploadFile(data)
      console.log(tx)
      const ftx = await writeArweaveAdd(tx);
      console.log('ftx', ftx)
      alert(`sucessfully stored on arweave and blockchain, hash: ${ftx.hash}`)
      // setURI(`${(tx as any).id}`)
    } catch (err) {
      // console.log('error for initialize bundlr', err)
      alert('something went wrong')
    }
  }
  return (
    <>
      <button
        className="mt-4 border-2 border-black"
        onClick={() =>
          makeArweave({
            from: 'tim',
            to: 'joe',
            subject: 'hello',
            body: 'hello world',
          })
        }
      >
        Store on Arweave!
      </button>
      {/* {URI && <span>id on bundlr devnet :{URI}</span>} */}
    </>

  )
}

export default WriteArButton;
