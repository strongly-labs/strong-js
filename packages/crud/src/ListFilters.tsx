/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions */

import * as React from 'react'
import { matchSorter } from 'match-sorter'
import {
  useAsyncDebounce,
  UseFiltersColumnProps,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersOptions,
  ColumnGroup,
  Row,
} from 'react-table'
import { SearchInput, Button, SelectField, minorScale } from 'evergreen-ui'

export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: UseGlobalFiltersOptions<Record<string, unknown>> &
  UseGlobalFiltersInstanceProps<Record<string, unknown>>) => {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState<any>(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <SearchInput
      value={value || ''}
      placeholder={`${count} records`}
      onChange={(e: any) => {
        setValue(e.target.value)
        onChange(e.target.value)
      }}
    />
  )
}

export const DefaultColumnFilter = ({
  column,
}: {
  column: ColumnGroup & UseFiltersColumnProps<Record<string, unknown>>
}) => {
  const { filterValue, setFilter, Header } = column
  return (
    <SearchInput
      value={filterValue || ''}
      onChange={(e: any) => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`${Header}`}
      width="100%"
      height={minorScale(6)}
    />
  )
}

export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}: {
  column: ColumnGroup & UseFiltersColumnProps<Record<string, unknown>>
}) => {
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id!])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  return (
    <SelectField
      value={filterValue}
      onChange={(e: any) => {
        setFilter(e.target.value || undefined)
      }}
      marginBottom={0}
      size="small"
    >
      <option key="select_all" value="">
        All
      </option>
      {options.map((option: any, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </SelectField>
  )
}

export const SliderColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}: {
  column: ColumnGroup & UseFiltersColumnProps<Record<string, unknown>>
}) => {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id!] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id!] : 0
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id!], min)
      max = Math.max(row.values[id!], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10))
        }}
      />
      <Button onClick={() => setFilter(undefined)}>Off</Button>
    </>
  )
}

export const NumberRangeColumnFilter = ({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}: {
  column: ColumnGroup & UseFiltersColumnProps<Record<string, unknown>>
}) => {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id!] : 0
    let max = preFilteredRows.length ? preFilteredRows[0].values[id!] : 0
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id!], min)
      max = Math.max(row.values[id!], max)
    })
    return [min, max]
  }, [id, preFilteredRows])

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  )
}

export const fuzzyTextFilterFn = (
  rows: Row[],
  id: string,
  filterValue: string,
) => {
  return matchSorter(rows, filterValue, {
    keys: [(row: any) => row?.values?.[id]],
  })
}

fuzzyTextFilterFn.autoRemove = (val: any) => !val

// Define a custom filter filter function!
export const filterGreaterThan = (
  rows: Row[],
  id: string,
  filterValue: string,
) => {
  return rows.filter((row) => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val: any) => typeof val !== 'number'

export const getFilters = (field: FormField) => {
  switch (field.type) {
    case 'Select': {
      return { Filter: SelectColumnFilter, filter: 'includes' }
    }
    default: {
      return {}
    }
  }
}
