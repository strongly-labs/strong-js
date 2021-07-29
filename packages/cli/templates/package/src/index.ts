import type {
  User,
  Account,
  Asset,
} from '@prisma/client'

export type FullUser = User & {
  accounts: Account[]
  assets: Asset[]
}

interface AuthorizeResult {
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

export interface RefreshResult {
  accessToken: string
  accessTokenExpirationDate: string
  additionalParameters?: { [name: string]: string }
  idToken: string
  refreshToken: string | null
  tokenType: string
}

export interface ApiConfig {
  host: string
}

interface HttpResponse<T> extends Response {
  json: () => Promise<T>
}

const fetcher = (accessToken?: string | undefined, config?: any) => <T>(
  url: string,
): Promise<HttpResponse<T>> =>
  fetch(url, {
    headers: {
      ...(accessToken && { authorization: 'Bearer ' + accessToken }),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'stly-auth-provider': 'google',
    },
    ...config,
  })

export const newUser = async (
  authInfo: AuthorizeResult | RefreshResult,
  config: ApiConfig,
) => {
  try {
    const payload = {
      method: 'POST',
      body: JSON.stringify(authInfo),
    }
    const newUserRes = await fetcher(
      authInfo?.accessToken,
      payload,
    )<FullUser>(`${config.host}/api/auth/user`)
    return await newUserRes?.json()
  } catch (error) {
    console.log(error)
  }
  return null
}

export const getUser = async (
  authInfo: AuthorizeResult | RefreshResult,
  config: ApiConfig,
) => {
  try {
    const res = await fetcher(authInfo?.accessToken)<FullUser>(
      `${config.host}/api/auth/user`,
    )
    switch (res.status) {
      case 200: {
        const user = await res.json()
        return user?.email ? user : await newUser(authInfo, config)
      }
      case 401: {
        console.log('unauthorized')
        break
      }
      default: {
        console.log('unknown', res.status)
        break
      }
    }
  } catch (error) {
    console.error(error)
  }
  return null
}
