/* eslint-disable no-unused-vars */

import { FullUser } from '../lib'

declare module 'next-auth' {
  interface Session {
    user: Partial<FullUser>
  }
}
