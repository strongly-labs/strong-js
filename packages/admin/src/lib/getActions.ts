/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { getQueryString, mapForeignKeysWithData } from './utils'

const getActions = ({
  route,
  include: includeFields,
  where: whereFields,
  parent,
}: getActionsProps): CrudActions => ({
  getAll: () => {
    if (route) {
      const params: QueryParams = {}
      const include = includeFields?.join(',')
      const where = mapForeignKeysWithData(whereFields, parent)

      if (include) {
        params.include = include
      }

      if (where && Object.keys(where).length > 0) {
        params.where = JSON.stringify(where)
      }
      const queryString = getQueryString(params) ?? ''

      return `${route}${queryString}`
    }
    return null
  },
  getOne: (id) => (route && id && `${route}/${id}`) || null,
  upsert: (data) => {
    const { id, ...updates } = data
    if (route) {
      const url = id ? `${route}/${id}` : route // eslint-disable-line  @typescript-eslint/restrict-template-expressions
      const method = id ? 'PATCH' : 'POST'
      return {
        url,
        method,
        updates: Object.fromEntries(
          Object.entries(updates).filter(([_, v]) => v !== ''),
        ),
      }
    }
    return {
      url: null,
    }
  },
  remove: (ids) => (route && ids && `${route}/${ids.join(',')}`) || null,
})

export default getActions
