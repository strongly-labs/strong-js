import React from 'react'

import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MuiTextField from '@material-ui/core/TextField'
import MuiSelectField from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

import { capitalize } from '@strong-js/common'
import type {
  FormFieldProps,
  SelectFieldProps,
  RenderFormProps,
} from '@strong-js/form'

export const TextField = (props: FormFieldProps) => (
  <FormControl
    required={!props.formField.disabled && props.formField.required}
    {...(props.formField.disabled && { disabled: true })}
  >
    <MuiTextField
      id={props.hookFormField.name}
      label={capitalize(props.hookFormField.name)}
      {...props.hookFormField}
    />
  </FormControl>
)

export const SelectField = (props: SelectFieldProps) => (
  <FormControl
    required={!props.formField.disabled && props.formField.required}
    {...(props.formField.disabled && { disabled: true })}
  >
    <InputLabel id={props.hookFormField.name}>
      {capitalize(props.hookFormField.name)}
    </InputLabel>

    <MuiSelectField
      id={props.hookFormField.name}
      labelId={props.hookFormField.name}
      value={props.hookFormField.value}
      onChange={(event) => {
        props.setValue(props.hookFormField.name, event.target.value)
      }}
    >
      {props.options?.map((option) => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
      ))}
    </MuiSelectField>
  </FormControl>
)

export const RenderForm = (props: RenderFormProps) => (
  <Box
    display="flex"
    flexDirection={'column'}
    borderRadius={3}
    textAlign="left"
    width="100%"
  >
    <form onSubmit={props.submitHandler}>
      <Box
        display="flex"
        justifyContent="space-between"
        padding={16}
        flexDirection="column"
      >
        {props.fields}
      </Box>
      <Box padding={16} display="flex" justifyContent="flex-end">
        <Button>Canel</Button>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </Box>
    </form>
  </Box>
)
