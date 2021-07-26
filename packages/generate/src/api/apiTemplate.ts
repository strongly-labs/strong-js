import { plural } from 'pluralize'

export const getResourceName = (model: string) => plural(model.toLowerCase())

export const nextCrudApiTemplate = (
  resourceName: string,
  prismaClientKey: string,
) => {
  return `
import NextCrud, {
  PrismaAdapter,
  HttpError,
  RouteType,
} from '@strongly/crud/src/lib/apiHandler'
import { authorize } from '@strongly/auth'
import { Role } from '@prisma/client'

const resourceName = '${resourceName}'

const acl = {
  [RouteType.CREATE]: [Role.ADMIN, Role.USER],
  [RouteType.READ_ALL]: [Role.ADMIN],
  [RouteType.READ_ONE]: [Role.ADMIN],
  [RouteType.UPDATE]: [Role.ADMIN],
  [RouteType.DELETE]: [Role.ADMIN],
}

/**
 * @swagger
 * /api/${resourceName}:
 *   get:
 *     description: Returns ${resourceName}
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns all ${resourceName}
 *
 *   post:
 *     description: create ${resourceName}
 *     parameters:
 *     responses:
 *       200:
 *         description: Creates and returns ${resourceName}
 *
 * /api/${resourceName}/[id]:
 *   get:
 *     description: Get ${prismaClientKey} by id 
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns single ${prismaClientKey} by id
 *
 *   patch:
 *     description: update ${prismaClientKey}
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated ${prismaClientKey}
 *
 *   delete:
 *     description: delete ${prismaClientKey}
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated ${prismaClientKey}
 */
const handler = NextCrud({
  resourceName,
  adapter: new PrismaAdapter({
    modelName: '${prismaClientKey}',
  }),
  onRequest: async (req) => {
    const authorized = await authorize(req, resourceName, acl)
    if (!authorized) {
      throw new HttpError(401, 'Access Denied')
    }
  },
})
export default handler
`
}
