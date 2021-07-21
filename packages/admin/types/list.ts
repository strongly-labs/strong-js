import { BadgeOwnProps } from 'evergreen-ui'
import { FormField } from './form'
import {
  Column,
  ColumnInstance,
  Row,
  TableToggleHideAllColumnProps,
  UseTableCellProps,
} from 'react-table'
import { CrudActions } from '../lib/getActions'

export interface CellValueBasedConfig {
  [k: string]:
    | BadgeOwnProps['color']
    | {
        [k: string]: BadgeOwnProps['color']
      }
}
export interface ColumnConfig {
  idColumn: string
  editable: boolean
  exclude?: string[]
  badges?: CellValueBasedConfig
  pills?: CellValueBasedConfig
}

export interface ListState {
  editorOpen: boolean
  setEditorOpen: React.Dispatch<React.SetStateAction<boolean>>
  selected: Row | null
  setSelected: React.Dispatch<React.SetStateAction<any>>
  showFilters: boolean
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>
}

type Mutation = (
  data?: any,
  shouldRevalidate?: boolean | undefined,
) => Promise<any>
export interface Context {
  schema: FormField | null
  state: ListState
  actions: CrudActions | null
  resource: string
  parent?: any
  data?: any[]
  mutate: Mutation
  config?: Partial<ColumnConfig>
}

export interface ListProviderProps
  extends Omit<Context, 'schema' | 'routes' | 'state' | 'actions' | 'mutate'> {
  state?: ListState
  actions?: CrudActions
  schema?: FormField | null
  mutate?: Mutation
}

export interface TableProps {
  columns: Array<Column<{}>>
  data: any
}

export interface ToggleColumnsProps {
  hideAllProps: TableToggleHideAllColumnProps
  allColumns: ColumnInstance<{}>[]
}

export interface CellProps {
  cell: UseTableCellProps<{}>
}

export interface ListHeaderProps {
  selectedFlatRows: Row<object>[]
  allColumns: ColumnInstance<object>[]
  getToggleHideAllColumnsProps: (
    props?: Partial<TableToggleHideAllColumnProps> | undefined,
  ) => TableToggleHideAllColumnProps
}
