
import NextCrud, {
  PrismaAdapter,
  HttpError,
  RouteType,
} from '@stly/admin/lib/apiHandler'
import { Role } from '@prisma/client'
import { authorize } from '@stly/auth/lib'

const resourceName = 'assets'

const acl = {
  [RouteType.CREATE]: [Role.ADMIN, Role.USER],
  [RouteType.READ_ALL]: [Role.ADMIN],
  [RouteType.READ_ONE]: [Role.ADMIN],
  [RouteType.UPDATE]: [Role.ADMIN],
  [RouteType.DELETE]: [Role.ADMIN],
}

/**
 * @swagger
 * /api/assets:
 *   get:
 *     description: Returns assets
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns all assets
 *
 *   post:
 *     description: create assets
 *     parameters:
 *     responses:
 *       200:
 *         description: Creates and returns assets
 *
 * /api/assets/[id]:
 *   get:
 *     description: Get asset by id 
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns single asset by id
 *
 *   patch:
 *     description: update asset
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated asset
 *
 *   delete:
 *     description: delete asset
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated asset
 */
const handler = NextCrud({
  resourceName,
  adapter: new PrismaAdapter({
    modelName: 'asset',
  }),
  onRequest: async (req) => {
    const authorized = await authorize(req, resourceName, acl)
    if (!authorized) {
      throw new HttpError(401, 'Access Denied')
    }
  },
})
export default handler
