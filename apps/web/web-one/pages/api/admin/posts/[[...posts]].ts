
import NextCrud, {
  PrismaAdapter,
  HttpError,
  RouteType,
} from '@strongly/admin/src/lib/apiHandler'
import { authorize } from '@strongly/auth'
import { Role } from '@prisma/client'

const resourceName = 'posts'

const acl = {
  [RouteType.CREATE]: [Role.ADMIN, Role.USER],
  [RouteType.READ_ALL]: [Role.ADMIN],
  [RouteType.READ_ONE]: [Role.ADMIN],
  [RouteType.UPDATE]: [Role.ADMIN],
  [RouteType.DELETE]: [Role.ADMIN],
}

/**
 * @swagger
 * /api/posts:
 *   get:
 *     description: Returns posts
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns all posts
 *
 *   post:
 *     description: create posts
 *     parameters:
 *     responses:
 *       200:
 *         description: Creates and returns posts
 *
 * /api/posts/[id]:
 *   get:
 *     description: Get post by id 
 *     parameters:
 *     responses:
 *       200:
 *         description: Returns single post by id
 *
 *   patch:
 *     description: update post
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated post
 *
 *   delete:
 *     description: delete post
 *     parameters:
 *     responses:
 *       200:
 *         description: Updated post
 */
const handler = NextCrud({
  resourceName,
  adapter: new PrismaAdapter({
    modelName: 'post',
  }),
  onRequest: async (req) => {
    const authorized = await authorize(req, resourceName, acl)
    if (!authorized) {
      throw new HttpError(401, 'Access Denied')
    }
  },
})
export default handler
