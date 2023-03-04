import axios from 'axios'

import { NextApiRequest, NextApiResponse } from 'next'

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  const { emailTo, emailSubject, markdownEmail } = req.body
  console.log('sendEmail materials', emailTo, emailSubject, markdownEmail)

  try {
    await axios.post(`${process.env.NEXT_BACKEND_URL}/send-email`, {
      to: emailTo,
      subject: emailSubject,
      message: markdownEmail,
    })
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export default sendEmail
