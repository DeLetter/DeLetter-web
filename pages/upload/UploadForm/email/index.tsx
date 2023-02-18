import React, { useState } from 'react'
import Button from '@components/Button'
import Error from 'next/error'

type SendEmailButtonProps = {
  emailTo: string
  emailSubject: string
  emailBody: string
}

const EmailSendingButton: React.FC<SendEmailButtonProps> = ({
  emailTo,
  emailSubject,
  emailBody,
}) => {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  const sendEmail = async () => {
    setEmailLoading(true)
    try {
      const mailtoLink = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`

      window.location.href = mailtoLink
    } catch (switchError: error | any) {
      setEmailError(true)
      setEmailErrorMessage(err.message)
    } finally {
      setEmailLoading(false)
    }
  }
  return (
    <Button
      onClick={sendEmail}
      className={
        'w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300'
      }
    >
      {emailLoading ? 'Sending...' : 'Send Email'}
    </Button>
  )
}

export default EmailSendingButton
