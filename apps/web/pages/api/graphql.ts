import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-micro'
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildSchema } from 'type-graphql'
import resolvers from '@stly/data/lib/graphql'
import authChecker from '@stly/auth/lib/authChecker'

export const config = {
  api: {
    bodyParser: false,
  },
}

const apollo = async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient()
  const typeSchema = await buildSchema({
    resolvers: [resolvers.UserRelationsResolver, resolvers.UserCrudResolver],
    authChecker,
    validate: false,
  })

  const apolloServer = new ApolloServer({
    schema: typeSchema,
    context: ({ req }) => ({ prisma, req }),
  })

  return apolloServer.createHandler({ path: '/api/graphql' })(req, res)
}

export default apollo
