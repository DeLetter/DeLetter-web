import React, { useState } from 'react'
import WarningBoard from '@modules/Warning'
import DownloadForm from './downloadForm'
import EmailTemplate from '@pages/download/EmailTemplate'

const DownLoad: React.FC = () => {
  const [mailingList, setMailingList] = useState('')
  return (
    <div className="w-4/5">
      <WarningBoard />
      <DownloadForm onSetMailingList={setMailingList} />
      <EmailTemplate mailingList={mailingList} />
    </div>
  )
}

export default DownLoad
