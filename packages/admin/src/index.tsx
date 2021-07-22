// import * as React from 'react'
// import { List } from './components/List'
// import { Editor } from './components/Editor'
import { ColumnConfig } from './types/list'
// import { ListProvider } from './components/ListContext'

interface CrudProps {
  resourceName: string
  config: Partial<ColumnConfig>
}

const Crud = (_: CrudProps) => null
// (
//   <ListProvider resource={props.resourceName} config={props.config}>
//     <List />
//     <Editor />
//   </ListProvider>
// )

export default Crud
