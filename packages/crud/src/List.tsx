/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import * as React from 'react';

import { Checkbox, IconButton, EditIcon } from 'evergreen-ui';
import { ListContext } from './ListContext';
import { getFilters } from './ListFilters';
import { Table } from './Table';
import { Column } from 'react-table';
import { FieldTypes } from './lib/utils';

export const List = () => {
  const {
    schema,
    data,
    config,
    state: { setSelected, setEditorOpen },
  } = React.useContext(ListContext);

  const tableData = data ?? [];

  const fields = schema?.items ?? [];

  const fieldColumns = fields
    ?.filter(
      field =>
        field &&
        field.type !== FieldTypes.Related &&
        !config?.exclude?.includes(field.name)
    )
    ?.map(field => ({
      Header: field?.name,
      accessor: field?.name,
      type: field?.type,
      ...(field && getFilters(field)),
    }));

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
  };
  const systemColumns: any[] = [selectionColumn];

  if (config?.editable) {
    const editColumn: Column = {
      id: '_edit',
      Header: 'Edit',

      Cell: ({ row, toggleAllRowsSelected }) => (
        <IconButton
          icon={EditIcon}
          onClick={() => {
            toggleAllRowsSelected(false);
            setSelected(row);
            setEditorOpen(true);
          }}
        />
      ),
    };
    systemColumns.push(editColumn);
  }

  const columns = React.useMemo(
    () => [...systemColumns, ...(fieldColumns ?? [])],
    [fields]
  );

  const getCellContent = (val: any) => {
    const canRender = typeof val === 'string' || React.isValidElement(val);
    if (canRender) {
      return val;
    }
    return null;
  };

  const rows = React.useMemo(
    () =>
      tableData?.map((record: any) =>
        Object.entries(record).reduce((acc, [key, val]) => {
          return {
            ...acc,
            [key]: getCellContent(val),
          };
        }, {})
      ),
    [tableData]
  );

  return <Table columns={columns} data={rows} />;
};
