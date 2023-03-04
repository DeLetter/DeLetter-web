import React, { useState } from 'react'
import Button from '@components/Button'
import { SendEmail, handleSendingEmail } from '@services/EmailList'
import Error from 'next/error'

const EmailSendingButton: React.FC<SendEmail> = ({
  emailTo,
  emailSubject,
  emailBody,
}) => {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailSentMessage, setEmailSentMessage] = useState('')

  //TODO
  const sendEmail = async () => {
    try {
      let res = await handleSendingEmail({ emailTo, emailSubject, emailBody })
    } catch (err) {
      console.log(err)
    }
    // setEmailLoading(true)
    // try {
    //   const markdownEmail = htmlToMarkdown(emailBody)

    //   const response = await fetch('/api/sendEmail', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ emailTo, emailSubject, markdownEmail }),
    //   })
    // } catch (err: Error | any) {
    //   setEmailError(true)
    //   console.log(err.message)
    //   setEmailErrorMessage(err.message)
    // } finally {
    //   setEmailLoading(false)
    //   setEmailSent(true)
    // }
  }
  return (
    <Button
      onClick={sendEmail}
      className={
        'w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300'
      }
    >
      {emailLoading ? 'Sending...' : 'Send Email'}
      {emailError && <Error statusCode={500} title={emailErrorMessage} />}
      {emailSent && <div>Email sent successfully</div>}
    </Button>
  )
}

export default EmailSendingButton
