import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-micro'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

import { buildSchema } from 'type-graphql'
import { authChecker } from '@strong-js/auth'
import resolvers from './resolvers'

export const config = {
  api: {
    bodyParser: false,
  },
}
const prisma = new PrismaClient()

const apollo = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  res.setHeader('access-control-allow-methods', 'POST')

  //https://studio.apollographql.com
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com',
  )
  //Origin, X-Requested-With, Content-Type, Accept, Authorization,
  //Accept-Encoding, Content-Encoding, Date, Connection, Keep-Alive, Transfer-Encoding,
  //strong-auth-provider
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  const typeSchema = await buildSchema({
    resolvers: [resolvers.UserRelationsResolver, resolvers.UserCrudResolver],
    authChecker,
    validate: false,
  })

  const apolloServer = new ApolloServer({
    schema: typeSchema,
    context: ({ req }) => ({
      prisma,
      req,
    }),
  })

  await apolloServer.start()

  return apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export default apollo
