
import NextCrud, {
  PrismaAdapter,
  HttpError,
  RouteType,
} from '@strongly/admin/src/lib/apiHandler'
import { authorize } from '@strongly/auth'
import { Role } from '@prisma/client'

const resourceName = 'verificationrequests'

const acl = {
  [RouteType.CREATE]: [Role.ADMIN, Role.USER],
  [RouteType.READ_ALL]: [Role.ADMIN],
  [RouteType.READ_ONE]: [Role.ADMIN],
  [RouteType.UPDATE]: [Role.ADMIN],
  [RouteType.DELETE]: [Role.ADMIN],
}

/**
 * @swagger
 * /api/verificationrequests:
 *   get:
 *     description: Returns verificationrequests
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns all verificationrequests
 *
 *   post:
 *     description: create verificationrequests
 *     parameters:
 *     responses:
 *       200:
 *         description: Creates and returns verificationrequests
 *
 * /api/verificationrequests/[id]:
 *   get:
 *     description: Get verificationRequest by id 
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns single verificationRequest by id
 *
 *   patch:
 *     description: update verificationRequest
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated verificationRequest
 *
 *   delete:
 *     description: delete verificationRequest
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated verificationRequest
 */
const handler = NextCrud({
  resourceName,
  adapter: new PrismaAdapter({
    modelName: 'verificationRequest',
  }),
  onRequest: async (req) => {
    const authorized = await authorize(req, resourceName, acl)
    if (!authorized) {
      throw new HttpError(401, 'Access Denied')
    }
  },
})
export default handler
