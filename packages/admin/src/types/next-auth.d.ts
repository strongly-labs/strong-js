/* eslint-disable no-unused-vars */

import { FullUser } from '@strongly/auth'

declare module 'next-auth' {
  interface Session {
    user: Partial<FullUser>
  }
}
