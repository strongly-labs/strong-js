
import NextCrud, {
  PrismaAdapter,
  HttpError,
  RouteType,
} from '@stly/admin/lib/apiHandler'
import { Role } from '@prisma/client'
import { authorize } from '@stly/auth/lib'

const resourceName = 'accounts'

const acl = {
  [RouteType.CREATE]: [Role.ADMIN, Role.USER],
  [RouteType.READ_ALL]: [Role.ADMIN],
  [RouteType.READ_ONE]: [Role.ADMIN],
  [RouteType.UPDATE]: [Role.ADMIN],
  [RouteType.DELETE]: [Role.ADMIN],
}

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     description: Returns accounts
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns all accounts
 *
 *   post:
 *     description: create accounts
 *     parameters:
 *     responses:
 *       200:
 *         description: Creates and returns accounts
 *
 * /api/accounts/[id]:
 *   get:
 *     description: Get account by id 
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns single account by id
 *
 *   patch:
 *     description: update account
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated account
 *
 *   delete:
 *     description: delete account
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated account
 */
const handler = NextCrud({
  resourceName,
  adapter: new PrismaAdapter({
    modelName: 'account',
  }),
  onRequest: async (req) => {
    const authorized = await authorize(req, resourceName, acl)
    if (!authorized) {
      throw new HttpError(401, 'Access Denied')
    }
  },
})
export default handler
