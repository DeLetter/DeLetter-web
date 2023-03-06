import axios from 'axios'
import Encryption from '@utils/AES/encryption'

import { NextApiRequest, NextApiResponse } from 'next'

async function configInfo(req: NextApiRequest, res: NextApiResponse) {
  try {
    await axios
      .get(`${process.env.NEXT_BACKEND_URL}/config-info`)
      // .get(`http://localhost:5363/config-info`)
      .then((response) => {
        const encrypted = Encryption.encrypt(
          JSON.stringify(response.data),
          process.env.NEXT_PUBLIC_AES_KEY as string
        )
        res.status(200).json(encrypted)
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export default configInfo
