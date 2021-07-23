import NextAuth, { NextAuthOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@strongly/data'
import { getFullUserByEmail } from '../lib'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Email({
      server: {
        host: process.env.SMTP_HOST ?? '',
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER ?? '',
          pass: process.env.SMTP_PASSWORD ?? '',
        },
      },
      from: process.env.SMTP_FROM,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    session: async (session, user) => {
      if (typeof user?.id === 'string' && user?.email) {
        const fullUser = await getFullUserByEmail(user.email)
        if (session?.user) {
          session.user.id = String(fullUser?.id)
          session.user.role = fullUser?.role ?? undefined
          session.user.assets = fullUser?.assets
        }
      }
      return Promise.resolve(session)
    },
  },
}

export const authHandler = (req: any, res: any) =>
  NextAuth(req, res, nextAuthOptions)
export default authHandler
