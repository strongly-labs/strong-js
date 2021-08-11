import React from 'react'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MuiTextField from '@material-ui/core/TextField'
import MuiSelectField from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import DateFnsUtils from '@date-io/date-fns'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

import { capitalize } from '@strong-js/common'
import type {
  FormFieldProps,
  SelectFieldProps,
  RenderFormProps,
  DateFieldProps,
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

export const DateTimeField = (props: DateFieldProps) => {
  const value = props.hookFormField.value
    ? new Date(props.hookFormField.value)
    : null
  return (
    <FormControl
      required={!props.formField.disabled && props.formField.required}
      {...(props.formField.disabled && { disabled: true })}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          value={value}
          label={props.formField.name}
          onChange={(date) =>
            props.onChange && props.onChange(props.hookFormField.name, date)
          }
        />
      </MuiPickersUtilsProvider>
    </FormControl>
  )
}

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
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </MuiSelectField>
  </FormControl>
)

export const RenderForm = (props: RenderFormProps) => (
  <div style={{ marginTop: 16 }}>
    <Container maxWidth="xs">
      <form onSubmit={props.submitHandler}>
        <Grid container spacing={2}>
          {props.fields.filter(Boolean).map((field) => (
            <Grid item xs={12} sm={6}>
              {field}
            </Grid>
          ))}
        </Grid>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}
        >
          <Button>Canel</Button>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </Container>
  </div>
)
