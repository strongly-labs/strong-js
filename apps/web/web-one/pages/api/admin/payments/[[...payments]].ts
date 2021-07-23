
import NextCrud, {
  PrismaAdapter,
  HttpError,
  RouteType,
} from '@strongly/admin/src/lib/apiHandler'
import { authorize } from '@strongly/auth'
import { Role } from '@prisma/client'

const resourceName = 'payments'

const acl = {
  [RouteType.CREATE]: [Role.ADMIN, Role.USER],
  [RouteType.READ_ALL]: [Role.ADMIN],
  [RouteType.READ_ONE]: [Role.ADMIN],
  [RouteType.UPDATE]: [Role.ADMIN],
  [RouteType.DELETE]: [Role.ADMIN],
}

/**
 * @swagger
 * /api/payments:
 *   get:
 *     description: Returns payments
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns all payments
 *
 *   post:
 *     description: create payments
 *     parameters:
 *     responses:
 *       200:
 *         description: Creates and returns payments
 *
 * /api/payments/[id]:
 *   get:
 *     description: Get payment by id 
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns single payment by id
 *
 *   patch:
 *     description: update payment
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated payment
 *
 *   delete:
 *     description: delete payment
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated payment
 */
const handler = NextCrud({
  resourceName,
  adapter: new PrismaAdapter({
    modelName: 'payment',
  }),
  onRequest: async (req) => {
    const authorized = await authorize(req, resourceName, acl)
    if (!authorized) {
      throw new HttpError(401, 'Access Denied')
    }
  },
})
export default handler
