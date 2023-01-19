import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Encryption } from '@utils/AES/encryption'
import { bundlrStore } from '@store/Bundlr'
import { getAddress } from 'services/readAreave'
import React from 'react'

const LoadData: React.FC = () => {
  const [loadedData, setLoadedData] = useState('')
  const {
    register,
    handleSubmit: withForm,
    formState: { errors },
  } = useForm()
  const bundlrInstance = bundlrStore.getState().bundlrInstance

  const handleSubmit = useCallback(
    withForm(async (data) => {
      const { enteredpassword } = data
      const arId = await getAddress()
      if (!arId) {
        console.log('arId is undefined')
        return
      }
      const res = await fetch(`https://arweave.net/${arId}`)
      const arweaveRes = await res.json()
      const decryptedData = await Encryption.decrypt(
        arweaveRes,
        enteredpassword
      )
      setLoadedData(JSON.stringify(decryptedData))
    }),
    [bundlrInstance]
  )

  return (
    <div className="flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="mb-[19px]">
        <div className="mb-[14px] flex flex-col">
          <label htmlFor="password">Enter your password: </label>
          <input
            type="password"
            id="enteredpassword"
            {...register('enteredpassword', { required: true })}
            className="border-2"
          />
          {errors.enteredpassword && (
            <div className="text-red-500">This field is required</div>
          )}
        </div>
        <button className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300">
          Load data from arweave
        </button>
      </form>
      <div className="flex-auto border-[2px] border-black border-dashed">
        {loadedData}
      </div>
      <a
        className="mt-[19px] w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300"
        href={`mailto:${loadedData}`}
      >
        Send emails
      </a>
    </div>
  )
}

export default LoadData
