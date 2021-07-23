import { IncomingMessage } from 'http'
import { Profile } from 'next-auth'
import { AppOptions } from 'next-auth/internals'
import { AdapterInstance } from 'next-auth/adapters'
import {
  User,
  Role,
  Session,
  Account,
  Asset,
  PrismaClient,
} from '@prisma/client'
import { prisma } from '@strongly/data'
import { getSession } from 'next-auth/client'
import { nextAuthOptions } from '../web/handler'
import { GetRouteType, getRouteType } from '@premieroctet/next-crud/dist/utils'
import { AuthChecker } from 'type-graphql'

export type DecodedToken = {
  email: string
  sub: string
  aud: string
  exp: string
}
export type Decoder = (token: string | undefined) => Promise<DecodedToken> // eslint-disable-line no-unused-vars

type PrismaAdapter = AdapterInstance<
  User,
  Profile & {
    emailVerified?: Date | undefined
  },
  Session
>

export type FullUser = User & {
  accounts: Account[]
  assets: Asset[]
}

export interface AuthInfo {
  accessToken: string
  accessTokenExpirationDate: string
  authorizeAdditionalParameters?: { [name: string]: string }
  tokenAdditionalParameters?: { [name: string]: string }
  idToken: string
  refreshToken: string
  tokenType: string
  scopes: string[]
  authorizationCode: string
  codeVerifier?: string
}
export interface ProviderConfig {
  [key: string]: {
    providerId: string
    providerType: string
    decoder: Decoder
  }
}

export const privoderConfig: ProviderConfig = {
  google: {
    providerId: 'google',
    providerType: 'oauth',
    decoder: async (token) =>
      fetch(
        `https://oauth2.googleapis.com/tokeninfo?access_token=${String(token)}`,
      )
        .then((r) => r.json())
        ?.catch((error) => {
          throw error
        }),
  },
}

export const clients = [
  process.env.OAUTH_GOOGLE_CLIENT_ID_ANDROID,
  process.env.OAUTH_GOOGLE_CLIENT_ID_IOS,
]

export const parseHeaders = (headers: IncomingMessage['headers']) => ({
  accessToken: headers?.authorization?.replace('Bearer ', ''),
  provider: headers?.['stly-auth-provider'],
})

export const newUser = async (
  adapter: PrismaAdapter,
  provider: string | string[] | undefined,
  tokenInfo: Partial<AuthInfo>,
) => {
  try {
    const { decoder } = privoderConfig?.[provider as string]
    const { email, sub } = await decoder?.(tokenInfo?.accessToken)
    if (email) {
      try {
        const user =
          (await adapter.getUserByEmail(email)) ??
          (await adapter.createUser({
            email,
          }))
        await adapter.linkAccount(
          user?.id,
          provider as string,
          'oauth',
          sub,
          tokenInfo?.refreshToken,
          tokenInfo?.accessToken,
        )
        return user
      } catch (error) {
        console.error(error)
      }
    }
  } catch (error) {
    console.error(error)
  }

  return null
}

export const getFullUserByEmail = async (
  email: string,
  client?: PrismaClient,
) => {
  try {
    const query = {
      where: { email },
      include: { accounts: true, assets: true },
    }
    if (client) {
      return await client.user.findUnique(query)
    }
    return await prisma.user.findUnique(query)
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getEmailFromToken = async (
  provider: string | string[] | undefined,
  accessToken: string | undefined,
): Promise<string | null> => {
  try {
    if (typeof provider === 'string' && typeof accessToken === 'string') {
      const { decoder } = privoderConfig?.[provider]
      const { email, exp, aud } = await decoder?.(accessToken)
      if (Number(exp) < Date.now() && clients?.includes(aud)) {
        return email
      }
    }
  } catch (error) {
    console.error(error)
  }
  return null
}

export const getAuthenticatedUser = async (
  provider: string | string[] | undefined,
  accessToken: string | undefined,
): Promise<Partial<FullUser> | null> => {
  try {
    if (typeof provider === 'string' && typeof accessToken === 'string') {
      const email = await getEmailFromToken(provider, accessToken)
      if (email) {
        const user = await getFullUserByEmail(email)
        if (user?.email && user?.accounts?.length > 0) {
          return user
        }
      }
      return {}
    }
  } catch (error) {
    console.error(error)
  }

  return null
}

export const getAuthContext = async (req: IncomingMessage) => {
  const { adapter } = nextAuthOptions
  const session = await getSession({ req })
  const { provider, accessToken } = parseHeaders(req.headers)
  const adapterInstance = (await adapter?.getAdapter({
    session: {},
    baseUrl: {},
    secret: '',
  } as AppOptions)) as PrismaAdapter
  return { provider, accessToken, session, adapterInstance }
}

export const getUserFromTokens = async (req: IncomingMessage) => {
  const { provider, accessToken } = await getAuthContext(req)
  return await getAuthenticatedUser(provider, accessToken)
}

export const authorize = async (
  req: any,
  resourceName: string,
  acl: { [k: string]: Role[] },
) => {
  const session = await getSession({ req })
  const user = session?.user ?? (await getUserFromTokens(req))
  if (user) {
    try {
      const { url, method } = req
      if (url && method) {
        const { routeType, resourceId } = getRouteType({
          url,
          method,
          resourceName,
        }) as GetRouteType

        const isOwner = resourceId
          ? user.id === resourceId ||
            Boolean(
              user?.assets?.find((item) => item.resourceId === resourceId),
            )
          : false

        return (
          (routeType && user?.role && acl?.[routeType]?.includes(user?.role)) ||
          isOwner
        )
      }
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

interface Context {
  req: any
  prisma: PrismaClient
}

export const authChecker: AuthChecker<Context> = async (
  { args, context },
  roles,
) => {
  const { req } = context
  const { provider, accessToken } = await getAuthContext(req)
  const email = await getEmailFromToken(provider, accessToken)
  if (email) {
    const user = await getFullUserByEmail(email, context?.prisma)
    if (user && typeof user?.role === 'string') {
      const resourceId = String(args?.where?.id) // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const isOwner = resourceId
        ? user.id === resourceId ||
          Boolean(
            user.assets.find((item: any) => item.resourceId === resourceId),
          )
        : false

      return roles.includes(user?.role) || isOwner
    }
  }

  return false
}
