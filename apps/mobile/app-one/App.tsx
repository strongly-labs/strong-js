/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/explicit-function-return-type, react-native/no-color-literals, no-console  */
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'

import ENV from 'react-native-config'

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'

import {
  authorize,
  AuthorizeResult,
  refresh,
  RefreshResult,
} from 'react-native-app-auth'
import { getUser } from '@strong-js/auth-mobile'

import { User } from '@prisma/client'
import { getAuthConfiguration } from './src/utils'
import { useStorage } from './src/storage'
import Intro from './src/Intro'

const sharedContent = {
  name: 'Shared Content',
}

const host = ENV.API_HOST
const httpLink = createHttpLink({
  uri: `${ENV.API_HOST}/api/graphql`,
})

const publicClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

const Section: React.FC<{
  title: string
}> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark'
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  )
}

const config = getAuthConfiguration()

const App = (): React.ReactElement => {
  const isDarkMode = useColorScheme() === 'dark'
  const [user, setUser] = useState<Partial<User> | null>(null)
  const [auth, setAuth] = useStorage<AuthorizeResult | RefreshResult | null>(
    'auth',
  )
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(
    publicClient,
  )

  const signIn = async () => {
    setAuth(await authorize(config))
  }

  const signOut = () => {
    setAuth(null)
  }

  useEffect(() => {
    if (auth?.accessTokenExpirationDate) {
      const exp = new Date(auth.accessTokenExpirationDate)?.getTime()
      const { refreshToken } = auth
      if (exp < Date.now() && refreshToken) {
        console.log('refreshing')
        void refresh(config, { refreshToken }).then((refreshResult) => {
          console.log('refreshResult', refreshResult)
          setAuth(refreshResult)
        })
      }
    }
  }, [])

  useEffect(() => {
    if (auth) {
      void getUser(auth, { host }).then((userData) => {
        setUser(userData)
      })

      const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        // return the headers to the context so httpLink can read them
        return {
          headers: {
            ...headers,
            authorization: auth?.accessToken
              ? `Bearer ${auth?.accessToken}`
              : '',
            'strong-auth-provider': 'google',
          },
        }
      })

      setClient(
        new ApolloClient({
          link: authLink.concat(httpLink),
          cache: new InMemoryCache(),
        }),
      )
    }
  }, [auth])

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
        >
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}
          >
            <Section title="Shared Content">{sharedContent.name}</Section>
            <View style={styles.signIn}>
              {user?.email ? (
                <>
                  <Text style={styles.signedIn}>
                    Signed in as {user?.email}
                  </Text>
                  <Intro id={user?.id} />
                  <TouchableOpacity
                    onPress={signOut}
                    style={styles.signInButton}
                  >
                    <Text style={styles.signInButtonText}>Sign out</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={signIn} style={styles.signInButton}>
                  <Text style={styles.signInButtonText}>
                    Sign in with Google
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions />
            </Section>
            <Section title="Debug">
              <DebugInstructions />
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ApolloProvider>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  signIn: {
    width: '100%',
    alignItems: 'center',
  },
  signedIn: {
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    marginTop: 16,
  },
  signInButton: {
    padding: 8,
    backgroundColor: '#3366FF',
    width: 160,
    margin: 32,
    alignItems: 'center',
    borderRadius: 4,
  },
  signInButtonText: {
    color: '#FFFFFF',
  },
})

export default App
