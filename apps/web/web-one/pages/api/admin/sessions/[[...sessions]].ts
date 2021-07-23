
import NextCrud, {
  PrismaAdapter,
  HttpError,
  RouteType,
} from '@strongly/admin/src/lib/apiHandler'
import { authorize } from '@strongly/auth'
import { Role } from '@prisma/client'

const resourceName = 'sessions'

const acl = {
  [RouteType.CREATE]: [Role.ADMIN, Role.USER],
  [RouteType.READ_ALL]: [Role.ADMIN],
  [RouteType.READ_ONE]: [Role.ADMIN],
  [RouteType.UPDATE]: [Role.ADMIN],
  [RouteType.DELETE]: [Role.ADMIN],
}

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     description: Returns sessions
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns all sessions
 *
 *   post:
 *     description: create sessions
 *     parameters:
 *     responses:
 *       200:
 *         description: Creates and returns sessions
 *
 * /api/sessions/[id]:
 *   get:
 *     description: Get session by id 
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns single session by id
 *
 *   patch:
 *     description: update session
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated session
 *
 *   delete:
 *     description: delete session
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated session
 */
const handler = NextCrud({
  resourceName,
  adapter: new PrismaAdapter({
    modelName: 'session',
  }),
  onRequest: async (req) => {
    const authorized = await authorize(req, resourceName, acl)
    if (!authorized) {
      throw new HttpError(401, 'Access Denied')
    }
  },
})
export default handler
