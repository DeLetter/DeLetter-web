import React, { useState } from 'react'
import { useEmailList } from '@services/EmailList'
import QuillText from './quillText'
import EmailSendingButton from '../EmailButton'

const EmailTemplate: React.FC = () => {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const emailList = useEmailList()

  return (
    <>
      <div className="mb-4">
        <h1>Email Template</h1>
        <label>Subject:</label>
        <input
          type="text"
          className="border-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <label>Body:</label>
        <QuillText value={body} onChange={setBody} />
        <p>{emailList}</p>
      </div>
      <EmailSendingButton
        emailTo={emailList}
        emailSubject={subject}
        emailBody={body}
      />
      <h3>Preview</h3>
      <h4>{subject}</h4>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  )
}

export default EmailTemplate
