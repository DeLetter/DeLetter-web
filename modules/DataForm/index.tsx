import { useCallback } from 'react'
import { useForm } from "react-hook-form";
import { bundlrStore } from '@store/Bundlr';
import { emailDataStore } from '@store/EmailData';
import { Email } from 'types/email.interface'
import { connectContract } from '@utils/contracts'
import { Encryption } from '@utils/AES/encryption'
import { UploadResponse } from '@bundlr-network/client/build/common/types'

//Store on Arweave and write related data on blockchain
const WriteArButton: React.FC = () => {
  const { register, handleSubmit: withForm, formState: { errors } } = useForm()

  const bundlrInstance = bundlrStore.getState().bundlrInstance;

  const uploadFile = useCallback(
    async (data: Email) => {
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

  const handleSubmit = useCallback(withForm(async (data) => {
    try {
      const { lists, password } = data;
      const encrypted = Encryption.encrypt(lists, password);
      emailDataStore.setState({ encryptedData: encrypted })
      const tx = await uploadFile(data.lists)
      console.log(tx)
      const ftx = await writeArweaveAdd(tx)
      console.log('ftx', ftx)
      alert(`sucessfully stored on arweave and blockchain, hash: ${ftx.hash}`)
    } catch (err) {
      alert('something went wrong')
    }
  }), [bundlrInstance])
  // TODO: add error notification
  return (
    <form onSubmit={handleSubmit}>
      <h2>Encrypt Your Email lists !</h2>
      <div className="flex flex-col">
        <label htmlFor="lists">Email lists</label>
        <input
          type="text"
          id="lists"
          {...register("lists", { required: true })}
          className="border-2"
        />
        {errors.lists && <div className='text-red-500'>This field is required</div>}
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Set your password: </label>
        <input
          type="password"
          id="password"
          {...register("password", { required: true })}
          className="border-2"
        />
        {errors.password && <div className='text-red-500'>This field is required</div>}
      </div>
      <button
        className="mt-4 border-2 p-2 border-black"
      >
        Already entered all the email data and is quite aware of the password.
        Now it’s time to encrypt these data with entered password !
      </button>
      <h2>Email Lists Encrypted : </h2>
      {emailDataStore.getState().encryptedData && <div className='text-green-500'>{emailDataStore.getState().encryptedData}</div>}
    </form>
  )
}

export default WriteArButton
