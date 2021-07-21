/* eslint-disable no-unused-vars, @typescript-eslint/no-unsafe-assignment */
import findConfig from 'find-config'
import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'

config({
  path: findConfig('.env.local') || findConfig('.env.test') || undefined,
})
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient
    }
  }
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
