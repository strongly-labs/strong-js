import * as React from 'react'
import { List } from './List'
import { Editor } from './Editor'
import { ColumnConfig } from '../types/list'
import { ListProvider } from './ListContext'

interface CrudProps {
  resourceName: string
  config: Partial<ColumnConfig>
}

const Crud = (props: CrudProps) => (
  <ListProvider resource={props.resourceName} config={props.config}>
    <List />
    <Editor />
  </ListProvider>
)

export default Crud
