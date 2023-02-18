import React, { useState } from 'react'
import WarningBoard from '@modules/Warning'
import DownloadForm from './components/downloadForm'
import EmailTemplate from '@pages/download/components/EmailTemplate'

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
