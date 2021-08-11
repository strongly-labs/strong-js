/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

import * as React from 'react'
import {
  useForm,
  Controller,
  FieldValues,
  Control,
  UseFormSetValue,
  SubmitHandler,
  ControllerRenderProps,
} from 'react-hook-form'

import { fetcher } from '@strong-js/common'

type HookFormField = ControllerRenderProps<FieldValues, string>
type labelValuePair = {
  label: string
  value: string
}

export interface FormFieldProps {
  hookFormField: HookFormField
  formField: FormField
}
export interface DateFieldProps extends FormFieldProps {
  onChange?: UseFormSetValue<FieldValues>
}

export interface SelectFieldProps extends FormFieldProps {
  options: labelValuePair[] | undefined
  setValue: UseFormSetValue<FieldValues>
}

export interface RenderFormProps {
  submitHandler: any
  fields: (JSX.Element | null)[]
}
export interface FormUIAdapter {
  RenderForm: React.FC<RenderFormProps>
  SelectField: React.FC<SelectFieldProps>
  TextField: React.FC<FormFieldProps>
  DateTimeField: React.FC<FormFieldProps | DateFieldProps>
}
interface FormProps {
  adapter: FormUIAdapter
  action: SubmitHandler<any> | null
  onUpdate: (_: any) => void
  fields: (FormField | null)[] | null
  data: any
  horizontal?: boolean
}

interface FieldProps {
  adapter: FormUIAdapter
  control: Control<FieldValues>
  setValue: UseFormSetValue<FieldValues>
  data: any
}

const mapField = ({ adapter, control, setValue, data }: FieldProps) => (
  formField: FormField | null,
) => {
  if (!formField || formField.hidden) {
    return null
  }
  const { SelectField, TextField, DateTimeField } = adapter
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
            <TextField hookFormField={field} formField={formField} />
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
            <DateTimeField
              hookFormField={field}
              formField={formField}
              onChange={setValue}
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
            <SelectField
              formField={formField}
              hookFormField={field}
              options={options}
              setValue={setValue}
            />
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
  data,
  action,
  onUpdate,
  adapter,
}: FormProps) => {
  if (fields) {
    const { control, handleSubmit, setValue } = useForm()
    const { RenderForm } = adapter
    const formFields = fields
      .filter(Boolean)
      .map(mapField({ adapter, control, setValue, data }))

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
      <RenderForm fields={formFields} submitHandler={handleSubmit(onSubmit)} />
    )
  }
  return null
}
