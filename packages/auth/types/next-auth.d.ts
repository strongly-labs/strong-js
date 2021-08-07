/* eslint-disable no-unused-vars */

import type { FullUser } from '../src/lib'

declare module 'next-auth' {
  interface Session {
    user: Partial<FullUser>
  }
}
