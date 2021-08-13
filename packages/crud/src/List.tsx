/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import * as React from 'react'

import { Checkbox, IconButton, EditIcon } from 'evergreen-ui'
import { ListContext } from './ListContext'
import { getFilters } from './ListFilters'
import { Table } from './Table'
import { Column } from 'react-table'
import { FieldTypes } from '@strong-js/common'

export const List = () => {
  const {
    schema,
    data,
    config,
    state: { setSelected, setEditorOpen },
  } = React.useContext(ListContext)

  const fields = schema?.items ?? []

  const fieldColumns = fields
    ?.filter(
      (field) =>
        field &&
        field.type !== FieldTypes.Related &&
        !config?.exclude?.includes(field.name),
    )
    ?.map((field) => ({
      Header: field?.name,
      accessor: field?.name,
      type: field?.type,
      ...(field && getFilters(field)),
    }))

  const systemColumns = React.useMemo(() => {
    const selectionColumn: Column = {
      id: '_selection',
      Header: ({ getToggleAllPageRowsSelectedProps }) => (
        <Checkbox
          margin={0}
          padding={0}
          indeterminate
          {...getToggleAllPageRowsSelectedProps()}
        />
      ),

      Cell: ({ row }) => (
        <Checkbox indeterminate {...row.getToggleRowSelectedProps()} />
      ),
    }
    const columns: any[] = [selectionColumn]

    if (config?.editable) {
      const editColumn: Column = {
        id: '_edit',
        Header: 'Edit',

        Cell: ({ row, toggleAllRowsSelected }) => (
          <IconButton
            icon={EditIcon}
            onClick={() => {
              toggleAllRowsSelected(false)
              setSelected(row)
              setEditorOpen(true)
            }}
          />
        ),
      }
      columns.push(editColumn)
    }

    return columns
  }, [config, setSelected, setEditorOpen])

  const columns = React.useMemo(
    () => [...systemColumns, ...(fieldColumns ?? [])],
    [fieldColumns, systemColumns],
  )

  const getCellContent = (val: any) => {
    const canRender = typeof val === 'string' || React.isValidElement(val)
    if (canRender) {
      return val
    }
    return null
  }

  const rows = React.useMemo(
    () =>
      data?.map((record: any) =>
        Object.entries(record).reduce((acc, [key, val]) => {
          return {
            ...acc,
            [key]: getCellContent(val),
          }
        }, {}),
      ),
    [data],
  )

  return <Table columns={columns} data={rows} />
}
