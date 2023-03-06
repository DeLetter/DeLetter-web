import React, { useCallback } from 'react'
import Button from '@components/Button'
import {
  SendEmail,
  handleSendingEmail as _handleSendingEmail,
} from '@services/EmailList'
import cx from 'clsx'
import useInTransaction from '@hooks/useInTransaction'
import { showToast } from '@components/showToast'
import Error from 'next/error'

const EmailSendingButton: React.FC<SendEmail> = ({
  emailTo,
  emailSubject,
  emailBody,
}) => {
  const { inTransaction, execTransaction: handleSendingEmail } =
    useInTransaction(_handleSendingEmail)

  const sendEmail = useCallback(async () => {
    try {
      await handleSendingEmail({ emailTo, emailSubject, emailBody })
      console.log('intransaction', inTransaction)
    } catch (err) {
      console.log(err)
    }
  }, [handleSendingEmail, emailTo, emailSubject, emailBody, inTransaction])
  return (
    <Button
      onClick={sendEmail}
      className={cx(
        'w-full border-2 border-black p-2 items-center rounded-md hover:bg-black hover:text-white transition duration-300',
        inTransaction && 'pointer-events-none opacity-30'
      )}
    >
      {inTransaction ? 'Sending...' : 'Send Email'}
      {/* {emailError && <Error statusCode={500} title={emailErrorMessage} />} */}
    </Button>
  )
}

export default EmailSendingButton
