import React from 'react'

import {
  Pane,
  TextInputField,
  SelectMenu,
  Button,
  Strong,
  majorScale,
} from 'evergreen-ui'
import { capitalize } from '@strong-js/common'
import type {
  FormFieldProps,
  SelectFieldProps,
  RenderFormProps,
} from '@strong-js/form'

export const TextField = (props: FormFieldProps) => (
  <TextInputField
    id={props.hookFormField.name}
    label={capitalize(props.hookFormField.name)}
    required={!props.formField.disabled && props.formField.required}
    {...(props.formField.disabled && { disabled: true })}
    {...props.hookFormField}
  />
)

export const DateTimeField = (props: FormFieldProps) => (
  <TextInputField
    id={props.hookFormField.name}
    label={capitalize(props.hookFormField.name)}
    type="datetime-local"
    required={!props.formField.disabled && props.formField.required}
    {...(props.formField.disabled && { disabled: true })}
    {...props.hookFormField}
  />
)

export const SelectField = (props: SelectFieldProps) => (
  <Pane marginBottom={majorScale(3)}>
    <Pane marginBottom={majorScale(1)}>
      <Strong>{capitalize(props.hookFormField.name)}</Strong>
    </Pane>
    <SelectMenu
      title={`Select ${props.hookFormField.name}`}
      options={props.options}
      selected={props.hookFormField.value}
      onSelect={(item) => props.setValue(props.hookFormField.name, item.value)}
    >
      <Button type="button">
        {props.hookFormField.value ||
          `Select ${capitalize(props.hookFormField.name)}`}
      </Button>
    </SelectMenu>
  </Pane>
)

export const RenderForm = (props: RenderFormProps) => (
  <Pane
    display="flex"
    flexDirection={'column'}
    borderRadius={3}
    textAlign="left"
    width="100%"
  >
    <form onSubmit={props.submitHandler}>
      <Pane
        display="flex"
        justifyContent="space-between"
        padding={16}
        flexDirection="column"
      >
        {props.fields}
      </Pane>
      <Pane
        background="blueTint"
        padding={16}
        display="flex"
        justifyContent="flex-end"
      >
        <Button marginRight={16}>Canel</Button>
        <Button type="submit" appearance="primary">
          Submit
        </Button>
      </Pane>
    </form>
  </Pane>
)
