/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions */

import * as React from 'react'
import {
  Pane,
  Popover,
  majorScale,
  Text,
  Strong,
  Button,
  Checkbox,
  Icon,
  EyeOpenIcon,
  TrashIcon,
  Position,
  FilterIcon,
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from 'evergreen-ui'
import { ListContext } from './ListContext'
import { HeaderGroup } from 'react-table'

const ToggleColumns = ({ hideAllProps, allColumns }: ToggleColumnsProps) => (
  <Pane
    display="flex"
    alignItems="flex-start"
    justifyContent="flex-start"
    flexDirection="column"
    padding={majorScale(1)}
  >
    <>
      <Checkbox indeterminate {...hideAllProps} label="All" />
    </>
    {allColumns
      ?.filter((column) => column.id !== 'actions')
      ?.map((column) => (
        <React.Fragment key={column.id}>
          <Checkbox {...column.getToggleHiddenProps()} label={column.id} />
        </React.Fragment>
      ))}
  </Pane>
)

export const ListHeader = ({
  selectedFlatRows,
  allColumns,
  getToggleHideAllColumnsProps,
}: ListHeaderProps) => {
  const selectedRowCount = Object.keys(selectedFlatRows)?.length
  const {
    config,
    actions,
    state: { setEditorOpen, showFilters, setShowFilters },
  } = React.useContext(ListContext)

  const idColumn = config?.idColumn ?? 'id'

  return (
    <Pane display="flex" paddingBottom={majorScale(1)}>
      <Pane flex={1} alignItems="center" display="flex">
        <Text marginRight={majorScale(2)}>{selectedRowCount} Selected</Text>
        {selectedRowCount > 0 && (
          <Pane>
            <Button
              appearance="primary"
              size="small"
              intent="danger"
              iconBefore={TrashIcon}
              marginRight={majorScale(1)}
              onClick={() =>
                actions?.remove(
                  selectedFlatRows?.map(
                    ({ original }: { original: Record<string, any> }) =>
                      original[idColumn],
                  ),
                )
              }
            >
              Delete
            </Button>
          </Pane>
        )}
      </Pane>
      <Pane>
        <Button
          appearance="primary"
          size="small"
          marginRight={majorScale(1)}
          iconBefore={FilterIcon}
          onClick={() => setShowFilters(!showFilters)}
          intent={showFilters ? 'danger' : 'none'}
        >
          Filter
        </Button>
        <Popover
          position={Position.BOTTOM_RIGHT}
          content={
            <ToggleColumns
              hideAllProps={getToggleHideAllColumnsProps()}
              allColumns={allColumns}
            />
          }
        >
          <Button
            appearance="primary"
            size="small"
            marginRight={majorScale(1)}
            iconBefore={EyeOpenIcon}
          >
            View
          </Button>
        </Popover>
        <Button
          appearance="primary"
          size="small"
          iconBefore={PlusIcon}
          onClick={() => setEditorOpen(true)}
        >
          Add
        </Button>
      </Pane>
    </Pane>
  )
}

export const renderHeader: any = (
  showFilters: boolean,
  column: HeaderGroup<Record<string, unknown>>,
) => {
  if (showFilters && column.canFilter) {
    return column.render('Filter')
  }
  return (
    <Pane
      width="100%"
      display="flex"
      {...column.getHeaderProps(column.getSortByToggleProps())}
    >
      <Strong
        color="gray700"
        size={300}
        paddingLeft={majorScale(1)}
        paddingRight={majorScale(1)}
      >
        {column.render('Header')}
      </Strong>
      {column.isSorted ? (
        column.isSortedDesc ? (
          <Icon
            icon={ChevronDownIcon}
            size={majorScale(2)}
            paddingRight={majorScale(1)}
          />
        ) : (
          <Icon
            icon={ChevronUpIcon}
            size={majorScale(2)}
            paddingRight={majorScale(1)}
          />
        )
      ) : (
        ''
      )}
    </Pane>
  )
}
