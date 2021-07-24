/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import * as React from 'react'
import TimeAgo from 'react-timeago'

import {
  Pane,
  SideSheet,
  Heading,
  Paragraph,
  Tablist,
  Tab,
  Card,
  majorScale,
} from 'evergreen-ui'

import { ListContext, ListProvider } from './ListContext'
import { Form } from './Form'
import { List } from './List'

enum EditorTab {
  DETAILS,
  RELATED,
}

const TabLabels = {
  [EditorTab.DETAILS]: 'Details',
  [EditorTab.RELATED]: 'Related',
}

export const Editor = () => {
  const {
    schema,
    data,
    mutate,
    config,
    actions,
    state: { selected, setSelected, editorOpen, setEditorOpen },
  } = React.useContext(ListContext)

  const idColumn = config?.idColumn ?? 'id'

  const selector = (item: Record<string, any>) => {
    const itemId = item?.[idColumn] ?? null
    if (itemId) {
      return itemId === selected?.values?.id
    }
    return null
  }

  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [editing, setEditing] = React.useState<any>(null)

  React.useEffect(() => {
    if (selected) {
      selected.toggleRowSelected(editorOpen)
      setEditing(data?.find(selector))
      if (!editorOpen) {
        setSelected(null)
        setEditing(null)
        setSelectedIndex(0)
      }
    }
  }, [selected, editorOpen])

  const onUpdate = (updates: any) => {
    void mutate(
      data?.map((item) => (selector(item) ? { ...item, ...updates } : item)),
    )
    setEditing(updates)
  }

  const fields = schema?.items ?? []

  const editorTabs = editing
    ? [EditorTab.DETAILS, EditorTab.RELATED]
    : [EditorTab.DETAILS]

  return (
    <SideSheet
      isShown={editorOpen}
      onCloseComplete={() => setEditorOpen(false)}
      containerProps={{
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
      }}
    >
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
        <Pane padding={16} borderBottom="muted">
          {editing ? (
            <>
              <Heading size={600}>
                Editing {editing?.name ?? editing?.[idColumn]}
              </Heading>
              <Paragraph size={400} color="muted">
                Last Updated <TimeAgo date={editing?.updatedAt} />
              </Paragraph>
            </>
          ) : (
            <>
              <Heading size={600}>Add New</Heading>
            </>
          )}
        </Pane>
        <Pane display="flex" padding={8}>
          <Tablist>
            {editorTabs.map((tab, index) => (
              <Tab
                key={tab}
                isSelected={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
              >
                {TabLabels[tab]}
              </Tab>
            ))}
          </Tablist>
        </Pane>
      </Pane>
      <Pane flex="1" overflowY="scroll" background="tint1" padding={16}>
        {selectedIndex === EditorTab.DETAILS && (
          <Card
            backgroundColor="white"
            elevation={0}
            display="flex"
            alignItems="center"
          >
            <Form
              action={actions?.upsert ?? null}
              onUpdate={onUpdate}
              fields={fields}
              data={editing}
            />
          </Card>
        )}
        {selectedIndex === EditorTab.RELATED &&
          Boolean(editing) &&
          fields
            ?.filter((field) => Boolean(field) && field?.type === 'Related')
            ?.map((relatedField) => {
              if (relatedField) {
                const { name } = relatedField
                const itemsData = editing?.[name] ?? []
                const items = relatedField?.items?.filter(
                  (item) => item?.modelName === schema?.modelName,
                )
                return (
                  <Card
                    key={name}
                    backgroundColor="white"
                    elevation={0}
                    display="flex"
                    alignItems="flex-start"
                    flexDirection="column"
                    marginBottom={majorScale(2)}
                  >
                    <Pane padding={16} borderBottom="muted" width="100%">
                      <Heading size={600} textTransform="capitalize">
                        {name}
                      </Heading>
                      <Paragraph size={400} color="muted">
                        {itemsData?.length ?? 0} items
                      </Paragraph>
                    </Pane>
                    {relatedField && (
                      <Pane width="100%" padding={majorScale(2)}>
                        <ListProvider
                          resource={name}
                          parent={editing}
                          schema={{
                            ...relatedField,
                            items,
                          }}
                          data={itemsData}
                        >
                          <List />
                          <Editor />
                        </ListProvider>
                      </Pane>
                    )}
                  </Card>
                )
              }
              return null
            })}
      </Pane>
    </SideSheet>
  )
}
