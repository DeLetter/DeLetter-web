import React, { useState } from 'react'
import QuillNoSSRWrapper from './quillText'

const EmailTemplate = () => {
  const [text, setText] = useState('')
  return (
    <>
      <div>
        <QuillNoSSRWrapper />
        <h1>Email Template</h1>
        <p>{text}</p>
      </div>
    </>
  )
}

export default React.memo(EmailTemplate)
