import NextAuth from 'next-auth'
import { nextAuthOptions } from './options'

export const authHandler = (req: any, res: any) =>
  NextAuth(req, res, nextAuthOptions)
export default authHandler
