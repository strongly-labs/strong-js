/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

import * as React from 'react'
import {
  useForm,
  Controller,
  FieldValues,
  Control,
  UseFormSetValue,
  SubmitHandler,
} from 'react-hook-form'
import {
  Pane,
  TextInputField,
  SelectMenu,
  Button,
  Strong,
  majorScale,
} from 'evergreen-ui'
import { fetcher, capitalize } from '@strong-js/common'

interface FormProps {
  action: SubmitHandler<any> | null
  onUpdate: (_: any) => void
  fields: (FormField | null)[] | null
  data: any
  horizontal?: boolean
}

interface FieldProps {
  control: Control<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  data: any
}

const mapField = ({ control, setValue, data }: FieldProps) => (
  formField: FormField | null,
) => {
  if (!formField || formField.hidden) {
    return null
  }
  switch (formField.type) {
    case 'Text': {
      return (
        <Controller
          key={formField.name}
          name={formField.name}
          control={control}
          defaultValue={data?.[formField.name] ?? ''}
          rules={{ required: formField.required }}
          render={({ field }) => (
            <TextInputField
              id={field.name}
              label={capitalize(field.name)}
              required={!formField.disabled && formField.required}
              {...(formField.disabled && { disabled: true })}
              {...field}
            />
          )}
        />
      )
    }
    case 'DateTime': {
      return (
        <Controller
          key={formField.name}
          name={formField.name}
          control={control}
          defaultValue={data?.[formField.name] ?? ''}
          rules={{ required: formField.required }}
          render={({ field }) => (
            <TextInputField
              id={field.name}
              label={capitalize(field.name)}
              required={!formField.disabled && formField.required}
              {...(formField.disabled && { disabled: true })}
              {...field}
            />
          )}
        />
      )
    }
    case 'Select': {
      const options = formField?.options?.map((label) => ({
        label,
        value: label,
      }))
      return (
        <Controller
          key={formField.name}
          name={formField.name}
          control={control}
          defaultValue={data?.[formField.name] ?? ''}
          render={({ field }) => (
            <Pane marginBottom={majorScale(3)}>
              <Pane marginBottom={majorScale(1)}>
                <Strong>{capitalize(field.name)}</Strong>
              </Pane>
              <SelectMenu
                title={`Select ${field.name}`}
                options={options}
                selected={field.value}
                onSelect={(item) => setValue(field.name, item.value)}
              >
                <Button type="button">
                  {field.value || `Select ${capitalize(field.name)}`}
                </Button>
              </SelectMenu>
            </Pane>
          )}
        />
      )
    }
    default: {
      return null
    }
  }
}

export const Form = ({
  fields,
  horizontal,
  data,
  action,
  onUpdate,
}: FormProps) => {
  if (fields) {
    const { control, handleSubmit, setValue } = useForm()

    const formFields = fields
      .filter(Boolean)
      .map(mapField({ control, setValue, data }))

    const onSubmit = async (input: any) => {
      try {
        if (action) {
          const { url, method, updates } = action({
            ...input,
            ...(data?.id && { id: data?.id }),
          })

          if (url && method && updates) {
            const response = await fetcher(url, {
              method,
              body: JSON.stringify(updates),
            })
            onUpdate({ ...response, ...input })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }

    return (
      <Pane
        display="flex"
        flexDirection={'column'}
        borderRadius={3}
        textAlign="left"
        width="100%"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Pane
            display="flex"
            justifyContent="space-between"
            flexDirection={horizontal ? 'row' : 'column'}
            padding={16}
          >
            {formFields}
          </Pane>
          <Pane
            background="blueTint"
            padding={16}
            display="flex"
            justifyContent="flex-end"
          >
            <Button marginRight={16}>Canel</Button>
            <Button type="submit" appearance="primary">
              Save
            </Button>
          </Pane>
        </form>
      </Pane>
    )
  }
  return null
}
