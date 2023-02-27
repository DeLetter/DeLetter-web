import React, { useState } from 'react'
import QuillText from './quillText'
import EmailSendingButton from '../EmailButton'

const EmailTemplate: React.FC<{ mailingList: string }> = ({ mailingList }) => {
  console.log('mailingList', mailingList)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  return (
    <>
      <div className="mb-4">
        <h1>Email Template</h1>
        <label>Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <QuillText value={body} onChange={setBody} />
        <p>{mailingList}</p>
      </div>
      <EmailSendingButton
        emailTo={mailingList}
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
