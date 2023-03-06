import axios from 'axios'

import { NextApiRequest, NextApiResponse } from 'next'

async function configInfo(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('configInfo')
    await axios
      //   .get(`${process.env.NEXT_BACKEND_URL}/config-info`)
      .get(`http://localhost:5363/config-info`)
      .then((response) => {
        res.status(200).json(response.data)
      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export default configInfo
