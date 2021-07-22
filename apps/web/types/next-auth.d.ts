/* eslint-disable no-unused-vars */

import { FullUser } from '@stly/auth/lib'

declare module 'next-auth' {
  interface Session {
    user: Partial<FullUser>
  }
}
