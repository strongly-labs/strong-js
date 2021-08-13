/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-empty-function */
import getActions from './lib/getActions'
import * as React from 'react'
import useSwr from 'swr'
import { plural, singular } from 'pluralize'

import { capitalize, fetcher, getIncludes } from '@strong-js/common'

const defaultColumnConfig: ColumnConfig = {
  idColumn: 'id',
  editable: true,
}

const value = {
  state: {
    editorOpen: false,
    setEditorOpen: () => {},
    selected: null,
    setSelected: () => {},
    showFilters: false,
    setShowFilters: () => {},
  },
  schema: null,
  mutate: () => Promise.resolve({}),
  actions: {
    getAll: () => undefined,
    getOne: () => '',
    upsert: () => {},
    remove: () => {},
  },
  resource: '',
  config: defaultColumnConfig,
}

const API_PREFIX = '/admin/api/s'

export const ListContext = React.createContext<Context>(value)
ListContext.displayName = 'ListContext'

export const ListProvider = ({
  resource,
  rootSchema,
  schema: prefetchedSchema,
  data: prefetchedData,
  parent,
  config,
  children,
}: React.PropsWithChildren<ListProviderProps>) => {
  const [schema, setSchema] = React.useState<FormField | null | undefined>(
    prefetchedSchema,
  )
  const [actions, setActions] = React.useState<CrudActions | null>(null)
  const [data, setData] = React.useState<any>(prefetchedData)
  const [selected, setSelected] = React.useState(null)
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(false)

  const { data: swrData, error, mutate } = useSwr(
    actions?.getAll() ?? null,
    fetcher,
  )

  React.useEffect(() => {
    try {
      if (!prefetchedSchema) {
        const modelName = capitalize(singular(resource))
        const modelSchema = rootSchema?.json.find(
          ({ name }) => name === modelName,
        )
        setSchema(modelSchema)
      }
    } catch (error) {
      console.error(error)
    }
  }, [resource])

  React.useEffect(() => {
    if (swrData && !error) {
      setData(swrData)
    } else {
      setData(prefetchedData)
    }
  }, [swrData, error])

  React.useEffect(() => {
    const include = getIncludes(schema)

    const routes = (field: string) =>
      field ? `${API_PREFIX}/${plural(field.toLowerCase())}` : null

    setActions(
      getActions({
        route: routes(schema?.name ?? ''),
        ...(include && { include }),
        ...(schema?.foreignKeys && { parent, where: schema?.foreignKeys }),
      }),
    )
  }, [schema])

  if (schema) {
    return (
      <ListContext.Provider
        value={{
          ...value,
          config: {
            ...defaultColumnConfig,
            ...config,
          },
          schema,
          data,
          parent,
          mutate,
          actions,
          state: {
            selected,
            setSelected,
            editorOpen,
            setEditorOpen,
            showFilters,
            setShowFilters,
          },
        }}
      >
        {children}
      </ListContext.Provider>
    )
  }
  return null
}
