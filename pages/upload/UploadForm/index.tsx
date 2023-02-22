import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import cx from 'clsx'
import { useUploadBundlr } from '@services/Bundlr'
import { EmailInfo } from '../../../types/email'
import { connectContract } from '@utils/contracts'
import { Encryption } from '@utils/AES/encryption'
import { parseCSV } from '@utils/cvsUtils'
import { UploadResponse } from '@bundlr-network/client/build/common/types'
import AuthConnectButton from '@modules/AuthConnectButton'
import Button from '@components/Button'

//TODO: 1, upload instead of setting 2. retrieve the previous data before uploading the new one
const UploadForm: React.FC = () => {
  const {
    register,
    handleSubmit: withForm,
    formState: { errors },
    setValue,
  } = useForm()
  const [hash, setHash] = useState('')
  const [isCSV, setIsCSV] = useState(false)

  const uploadBundlr = useUploadBundlr()

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
    []
  )

  const handleCSVChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target?.files?.length) return
      const csvResPromise = parseCSV(e.target?.files[0])
      csvResPromise
        .then((value) => {
          let res: string[] = value as string[]
          setValue('names', res[0])
          setValue('rawEmails', res[1])
        })
        .catch((err) => {
          console.log(err)
        })
    },
    [setValue]
  )

  const handleSubmit = useCallback(
    async (data: any) => {
      try {
        const { names, rawEmails, password } = data
        let nameList: string[] = []
        let emailList: string[] = []
        if (!isCSV) {
          nameList = names ? names.split(',') : []
          emailList = rawEmails ? rawEmails.split(',') : []
        } else {
          nameList = names
          emailList = rawEmails
        }
        let emailInfoList = nameList.map((name: string, i: number) => {
          return {
            name: name,
            email: emailList[i],
          }
        })
        const eimalInfoReady = JSON.stringify(emailInfoList)
        const encrypted = Encryption.encrypt(eimalInfoReady, password)
        console.log('encryptedData', encrypted)
        const tx = await uploadBundlr(encrypted)
        console.log(tx)
        let ftx = await writeArweaveAdd(tx)
        console.log('ftx', ftx)
        setHash(ftx.hash)
        alert(`sucessfully stored on arweave and blockchain, hash: ${ftx.hash}`)
      } catch (err) {
        alert(`something went wrong: ${err}`)
      }
    },
    [uploadBundlr, isCSV]
  )

  //   const check = async () => {
  //     if (!account) {
  //       await connect()
  //     }
  //     const emailList = await checkArweaveRecord(account)
  //     console.log('emailList', emailList)
  //     console.log(emailList[1])
  //     if (emailList.length > 0) {
  //       setHasEmailList(true)
  //       let arId = await getAddress()
  //       console.log('arId', arId)
  //       if (!arId) {
  //         console.log('arId is undefined, please retry')
  //         //TODO: temarary solution, need to improve
  //         arId = await getAddress()
  //         if (!arId) return
  //       }
  //       const res = await fetch(`https://arweave.net/${arId}`)

  //       const arweaveRes = await res.json()
  //       console.log('arweaveRes', arweaveRes)
  //       console.log('enteredpassword', getValues('password'))
  //       const decryptedData = await Encryption.decrypt(
  //         arweaveRes,
  //         getValues('password')
  //       )
  //       setLists(decryptedData)
  //       setValue('lists', decryptedData)
  //     }
  //   }
  //   check()
  // }, [account, checkArweaveRecord, connect, getValues, setValue])

  // TODO: add error notification
  return (
    <form onSubmit={withForm((data) => handleSubmit(data))}>
      <div className="mb-[14px] flex flex-col">
        <div className="flex flex-row justify-between">
          <span>
            Please enter you email list(Please, separate each item with comma)
          </span>
          <button
            className={cx(
              isCSV && 'underline decoration-1 text-black',
              'text-gray-400'
            )}
            onClick={(e) => {
              e.preventDefault()
              setIsCSV((pre) => {
                return !pre
              })
            }}
          >
            Use csv
          </button>
        </div>
        {!isCSV && (
          <div className="my-[14px] grid gird-rows-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="names">Please enter the name list</label>
              <input
                className="border-2"
                id="names"
                {...register('names')}
                placeholder="ricy, tim"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label htmlFor="rawEmails">Please enter the email list</label>
              <input
                className="border-2"
                id="rawEmails"
                {...(register('rawEmails'), { required: true })}
                placeholder="ricy@deletter.com, tim@deletter.com"
              />
              {errors.rawEmails?.type === 'required' && (
                <div className="text-red-500">This field is required</div>
              )}
            </div>
          </div>
        )}
        {isCSV && (
          <div className="flex items-center justify-center">
            <input
              type="file"
              accept=".csv"
              id="emailInfoList"
              {...(register('emailInfoList'), { required: true })}
              onChange={(e) => {
                handleCSVChange(e)
              }}
            />
            {errors.emailInfoList?.type === 'required' && (
              <div className="text-red-500">This field is required</div>
            )}
          </div>
        )}
      </div>
      <div className="mb-[14px] flex flex-col">
        <label className=" text-lg" htmlFor="password">
          Set your password:{' '}
        </label>
        <input
          type="password"
          id="password"
          {...register('password', {
            required: true,
          })}
          className="border-2"
        />
        {errors.password?.type === 'required' && (
          <div className="text-red-500">This field is required</div>
        )}
        {errors.password?.type === 'validate' && (
          <div className="text-red-500">Incorrect password</div>
        )}
      </div>
      <p className="mb-[14px]">
        Already entered all the email data and is quite aware of the password?
        Then it&apos;s time to encrypt these data and store in Arweave!
      </p>
      <AuthConnectButton>
        <Button>Encrypt and Update</Button>
      </AuthConnectButton>
      <h3 className="text-lg font-bold">Hash : </h3>
      {hash && <p className="text-green-500 break-all">{hash}</p>}
    </form>
  )
}

export default UploadForm
