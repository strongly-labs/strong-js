import type { SubmitHandler } from 'react-hook-form'
import type { BadgeOwnProps } from 'evergreen-ui'
import type {
  Column,
  ColumnInstance,
  Row,
  TableToggleHideAllColumnProps,
  UseTableCellProps,
} from 'react-table'

declare global {
  export interface ForeignKey {
    from: string[] | undefined
    to: string[] | undefined
  }

  export interface FormField {
    name: string
    type: string
    modelName?: string
    items?: (FormField | null)[] | null
    hidden?: boolean
    required?: boolean
    disabled?: boolean
    options?: string[]
    relationFromFields?: string[]
    relationToFields?: string[]
    foreignKeys?: (Record<string, ForeignKey> | null)[]
  }

  export interface FormConfig {
    disabled?: string[]
    hidden?: string[]
  }
  export interface getActionsProps {
    route?: string | null
    include?: (string | undefined)[]
    where?: FormField['foreignKeys']
    parent?: any
  }

  export interface CrudActions {
    getAll: () => string | undefined | null
    getOne: (_: string) => string | null
    remove: (_: string[]) => void
    upsert: SubmitHandler<any>
  }

  interface QueryParams {
    include?: string
    where?: string
  }

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
    rootSchema?: { json: any[] }
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
    extends Omit<
      Context,
      'schema' | 'routes' | 'state' | 'actions' | 'mutate'
    > {
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
}

export * from './utils'
