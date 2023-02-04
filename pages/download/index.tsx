import React from 'react'
import WarningBoard from '@modules/Warning'
import DownloadForm from './DownloadForm'

const DownLoad: React.FC = () => {
  return (
    <div className="w-4/5">
      <WarningBoard />
      <DownloadForm />
    </div>
  )
}

export default DownLoad
