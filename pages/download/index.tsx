import React, { useState } from 'react'
import WarningBoard from '@modules/Warning'
import DownloadForm from './DownloadForm'
import EmailTemplate from './EmailTemplate'

const DownLoad: React.FC = () => {
  const [mailingList, setMailingList] = useState('')
  return (
    <div className="w-4/5">
      <WarningBoard />
      <DownloadForm />
      <EmailTemplate />
    </div>
  )
}

export default DownLoad
