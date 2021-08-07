import {Platform} from 'react-native'
import {AuthConfiguration} from 'react-native-app-auth'
import ENV from 'react-native-config'

export const getAuthConfiguration = (): AuthConfiguration => ({
  issuer: ENV.OAUTH_GOOGLE_ISSUER,
  scopes: ENV.OAUTH_GOOGLE_SCOPES?.split(' ') ?? ['openid'],
  ...Platform.select({
    android: {
      clientId: ENV.OAUTH_GOOGLE_CLIENT_ID_ANDROID,
      redirectUrl: ENV.OAUTH_GOOGLE_REDIRECT_URL_ANDROID,
    },
    ios: {
      clientId: ENV.OAUTH_GOOGLE_CLIENT_ID_IOS,
      redirectUrl: ENV.OAUTH_GOOGLE_REDIRECT_URL_IOS,
    },
    default: {
      clientId: '',
      redirectUrl: '',
    },
  }),
})
