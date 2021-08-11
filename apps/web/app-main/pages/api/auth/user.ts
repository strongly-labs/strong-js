import type { NextApiRequest, NextApiResponse } from 'next'
import {
  newUser,
  getAuthContext,
  AuthInfo,
  getUserFromTokens,
} from '@strong-js/auth'

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      const user = await getUserFromTokens(req)
      if (user) {
        return res.json(user)
      }
      res.status(401).end()
      break
    }

    case 'POST': {
      const { accessToken, provider, adapterInstance } = await getAuthContext(
        req,
      )
      const { refreshToken } = req.body as AuthInfo
      const tokenInfo = {
        accessToken,
        refreshToken,
      }
      return res.json(await newUser(adapterInstance, provider, tokenInfo))
    }

    default: {
      res.status(405).end()
      break
    }
  }
}

export default handle
