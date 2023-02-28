import React, { useCallback, useState } from 'react'
import {
  useForm,
  UseFormSetValue,
  FieldValues,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form'
import { parseCSV } from '@utils/cvsUtils'

interface UpLoadCSVProps {
  setValue: UseFormSetValue<FieldValues>
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  firstLineName: string
  secondLineName?: string
}
const UpLoadCSV: React.FC<UpLoadCSVProps> = ({
  setValue,
  register,
  errors,
  firstLineName,
  secondLineName,
}) => {
  const handleCSVChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target?.files?.length) return
      const csvResPromise = parseCSV(e.target?.files[0])
      csvResPromise
        .then((value) => {
          let res: string[] = value as string[]
          setValue(`${firstLineName}`, res[0])
          setValue(`${secondLineName}`, res[1])
        })
        .catch((err) => {
          console.log(err)
        })
    },
    [firstLineName, secondLineName, setValue]
  )
  return (
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
  )
}

export default UpLoadCSV
