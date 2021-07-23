
import NextCrud, {
  PrismaAdapter,
  HttpError,
  RouteType,
} from '@strongly/admin/src/lib/apiHandler'
import { authorize } from '@strongly/auth'
import { Role } from '@prisma/client'

const resourceName = 'users'

const acl = {
  [RouteType.CREATE]: [Role.ADMIN, Role.USER],
  [RouteType.READ_ALL]: [Role.ADMIN],
  [RouteType.READ_ONE]: [Role.ADMIN],
  [RouteType.UPDATE]: [Role.ADMIN],
  [RouteType.DELETE]: [Role.ADMIN],
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Returns users
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns all users
 *
 *   post:
 *     description: create users
 *     parameters:
 *     responses:
 *       200:
 *         description: Creates and returns users
 *
 * /api/users/[id]:
 *   get:
 *     description: Get user by id 
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns single user by id
 *
 *   patch:
 *     description: update user
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated user
 *
 *   delete:
 *     description: delete user
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated user
 */
const handler = NextCrud({
  resourceName,
  adapter: new PrismaAdapter({
    modelName: 'user',
  }),
  onRequest: async (req) => {
    const authorized = await authorize(req, resourceName, acl)
    if (!authorized) {
      throw new HttpError(401, 'Access Denied')
    }
  },
})
export default handler
