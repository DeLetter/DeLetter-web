import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import cx from 'clsx'
import { Encryption } from '@utils/AES/encryption'
import { getAddress } from 'services/readAreave'
import { useEmailListStore } from '@services/EmailList'
import AuthConnectButton from '@modules/AuthConnectButton'
import Button from '@components/Button'
import useInTranscation from '@hooks/useInTransaction'

const LoadData: React.FC = () => {
  const {
    register,
    handleSubmit: withForm,
    formState: { errors },
  } = useForm()
  const { emailList, setEmailList } = useEmailListStore((state) => ({
    emailList: state.emailList,
    setEmailList: state.setEmailList,
  }))
  //TODO: Refactor this function to clear reduce useState hook
  const _handleSubmit = useCallback(
    withForm(async (data) => {
      const { enteredpassword } = data
      try {
        let arId = await getAddress()
        console.log('arId', arId)
        if (!arId) {
          console.log('arId is undefined, please retry')
          //TODO: temarary solution, need to improve
          arId = await getAddress()
          if (!arId) return
        }
        const res = await fetch(`https://arweave.net/${arId}`)

        const arweaveRes = await res.json()
        const decryptedData = await Encryption.decrypt(
          arweaveRes,
          enteredpassword
        )
        const parsedData = JSON.parse(decryptedData)
        setEmailList(parsedData)
      } catch (err) {
        console.log(err)
        alert(`Failed to fetch data, please retry`)
      }
    }),
    []
  )

  //TODO: extract requests
  const { inTransaction, execTransaction: handleSubmit } =
    useInTranscation(_handleSubmit)

  return (
    <div className="flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="mb-[19px]">
        <div className="mb-[14px] flex flex-col">
          <label htmlFor="password">
            Enter your password(same password you set when uploading data):{' '}
          </label>
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
        <AuthConnectButton className="w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300">
          <Button
            className={cx(
              'w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300',
              inTransaction && 'pointer-events-none opacity-30'
            )}
          >
            {inTransaction ? 'Loading...' : 'Load data from arweave'}
          </Button>
        </AuthConnectButton>
      </form>
      <div className="flex-auto min-h-[32px] border-[2px] border-black border-dashed mb-[19px]">
        {emailList}
      </div>
    </div>
  )
}

export default LoadData
