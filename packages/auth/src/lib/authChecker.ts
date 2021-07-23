import { AuthChecker } from 'type-graphql'
import { getAuthContext, getEmailFromToken, getFullUserByEmail } from './'
import { NextApiRequest } from 'next'
import { PrismaClient } from '@prisma/client'
interface Context {
  req: NextApiRequest
  prisma: PrismaClient
}

const authChecker: AuthChecker<Context> = async ({ args, context }, roles) => {
  const { req } = context
  const { provider, accessToken } = await getAuthContext(req)
  const email = await getEmailFromToken(provider, accessToken)
  if (email) {
    const user = await getFullUserByEmail(email, context?.prisma)
    if (user && typeof user?.role === 'string') {
      const resourceId = String(args?.where?.id) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const isOwner = resourceId
        ? user.id === resourceId ||
          Boolean(user?.assets?.find((item) => item.resourceId === resourceId))
        : false

      return roles.includes(user?.role) || isOwner
    }
  }

  return false
}

export default authChecker
