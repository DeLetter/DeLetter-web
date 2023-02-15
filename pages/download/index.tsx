import React from 'react'
import WarningBoard from '@modules/Warning'
import DownloadForm from './DownloadForm'
import EmailTemplate from '@modules/EmailTemplate'

const DownLoad: React.FC = () => {
  return (
    <div className="w-4/5">
      <WarningBoard />
      <DownloadForm />
      <EmailTemplate />
    </div>
  )
}

export default DownLoad
