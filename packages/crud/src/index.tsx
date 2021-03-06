import * as React from 'react'
import { List } from './List'
import { Editor } from './Editor'
import { ListProvider } from './ListContext'
interface CrudProps {
  rootSchema: Context['rootSchema']
  resourceName: string
  config: Partial<ColumnConfig>
}

const Crud = (props: CrudProps) => (
  <ListProvider
    rootSchema={props.rootSchema}
    resource={props.resourceName}
    config={props.config}
  >
    <List />
    <Editor />
  </ListProvider>
)

export default Crud
