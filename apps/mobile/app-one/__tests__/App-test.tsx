/**
 * @format
 */

import * as React from 'react'
import 'react-native'

import { render } from '@testing-library/react-native'
import Intro from '../src/Intro'

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
  refresh: jest.fn(),
  AuthorizeResult: {},
  RefreshResult: {},
}))

jest.mock('react-native-mmkv-storage', () => ({
  create: () => ({
    useStorage: () => [null, () => null],
  }),
  Loader: () => ({ withEncryption: () => ({ initialize: jest.fn() }) }),
}))

jest.mock('@apollo/client', () => ({
  createHttpLink: jest.fn(),
  gql: jest.fn(),
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn(),
}))

it('renders correctly', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const intro = render(<Intro />)
})
