/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import * as React from 'react'
import TimeAgo from 'react-timeago'

import {
  useTable,
  ColumnInstance,
  usePagination,
  useRowSelect,
  useSortBy,
  useFilters,
  useGlobalFilter,
} from 'react-table'

import {
  Pane,
  majorScale,
  minorScale,
  Pagination,
  Text,
  Code,
  Badge,
  Pill,
} from 'evergreen-ui'

import { CellProps, TableProps } from '../types/list'
import { DefaultColumnFilter, fuzzyTextFilterFn } from './ListFilters'

import { ListContext } from './ListContext'

import { FormField } from '../types/form'

import { ListHeader, renderHeader } from './ListHeader'

const TableCell = ({ cell }: CellProps) => {
  const { config } = React.useContext(ListContext)
  const { id, type }: Partial<FormField> & ColumnInstance<{}> = cell.column

  if (id === config?.idColumn) {
    return cell.value ? <Code size={300}>{cell.render('Cell')}</Code> : null
  }

  if (type === 'DateTime') {
    return cell.value ? (
      <Text size={300}>
        <TimeAgo date={cell.value} />
      </Text>
    ) : null
  }
  const badge = config?.badges?.[id]
  const badgeColor =
    badge && (typeof badge === 'string' ? badge : badge?.[cell?.value])

  if (badgeColor) {
    return (
      <Badge size={300} color={badgeColor}>
        {cell.render('Cell')}
      </Badge>
    )
  }

  const pill = config?.pills?.[id]
  const pillColor =
    pill && (typeof pill === 'string' ? pill : pill?.[cell?.value])

  if (pillColor) {
    return (
      <Pill display="inline-flex" color={pillColor}>
        {cell.render('Cell')}
      </Pill>
    )
  }

  return (
    <div style={styles.cellText}>
      <Text size={300}>{cell.render('Cell')}</Text>
    </div>
  )
}

export const Table = ({ columns, data }: TableProps) => {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    [],
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const {
    state: { showFilters },
  } = React.useContext(ListContext)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    allColumns,
    getToggleHideAllColumnsProps,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    selectedFlatRows,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    usePagination,
    useRowSelect,
  )

  return (
    <Pane>
      <ListHeader
        allColumns={allColumns}
        selectedFlatRows={selectedFlatRows}
        getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
      />
      <Pane width="100%" overflowX="auto">
        <table {...getTableProps()} style={styles.table}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup?.headers?.map((column, index) => (
                  <th key={column.id} style={styles.tableHeader}>
                    <div
                      style={{
                        ...styles.tableHeaderCell,
                        ...(index === headerGroup?.headers?.length - 1 && {
                          borderRight: 0,
                        }),
                      }}
                    >
                      <Pane display="flex" flexDirection="column">
                        {typeof column.Header === 'string'
                          ? renderHeader(showFilters, column)
                          : column.render('Header')}
                      </Pane>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr
                  {...row.getRowProps()}
                  style={{ ...(row.isSelected && { ...styles.selectedRow }) }}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td style={styles.td} {...cell.getCellProps()}>
                        <Pane
                          paddingLeft={majorScale(2)}
                          paddingRight={majorScale(2)}
                        >
                          <TableCell cell={cell} />
                        </Pane>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </Pane>
      <Pane display="flex" alignItems="center" justifyContent="center">
        <Pagination
          page={pageIndex + 1}
          totalPages={pageCount}
          onNextPage={() => {
            if (canNextPage) {
              nextPage()
            }
          }}
          onPreviousPage={() => {
            if (canPreviousPage) {
              previousPage()
            }
          }}
          onPageChange={(pageNumber) => {
            gotoPage(pageNumber - 1)
          }}
        ></Pagination>
      </Pane>
    </Pane>
  )
}

const styles = {
  table: {
    borderSpacing: 0,
    border: 0,
  },
  td: {
    margin: 0,
    padding: 0,
    borderBottom: '1px solid #E6E8F0',
  },
  cellText: {
    maxWidth: majorScale(30),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tableHeader: {
    margin: 0,
    padding: 0,
    fontSize: '0.8rem',
  },
  tableHeaderCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    borderRight: '1px solid #E6E8F0',
    borderBottom: '1px solid #E6E8F0',
    height: minorScale(10),
    padding: minorScale(1),
  },
  selectedRow: {
    background: '#F3F6FF',
  },
  pagination: {
    padding: '0.5rem',
  },
}
