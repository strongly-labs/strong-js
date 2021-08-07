/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DMMF } from '@prisma/generator-helper'

export const FieldTypes: Record<string, string> = {
  String: 'Text',
  DateTime: 'DateTime',
  Enum: 'Select',
  Related: 'Related',
  Reference: 'Reference',
  Model: 'Model',
}

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

export const hiddenFields = ['id', 'createdAt', 'updatedAt']
export const excludedFields: string[] = []

export const getField = (
  field: DMMF.Field,
  enums: DMMF.DatamodelEnum[],
): FormField | null => {
  const { name, kind, type, isRequired, relationFromFields, relationToFields } =
    field

  switch (kind) {
    case 'scalar': {
      const fieldType = FieldTypes?.[type] ?? null
      return {
        name,
        type: fieldType,
        required: isRequired,
        ...(hiddenFields.includes(name) && { hidden: true }),
      }
    }
    case 'enum': {
      const fieldType = FieldTypes.Enum
      const enumItem = enums.find(({ name }) => name === field.type)
      const options = enumItem?.values.map((item) => item.name)
      return {
        name,
        type: fieldType,
        required: isRequired,
        options,
      }
    }
    case 'object': {
      return {
        name,
        modelName: type,
        type: FieldTypes.Related,
        ...(Array.isArray(relationFromFields) &&
          relationFromFields?.length > 0 && {
            relationFromFields,
          }),
        ...(Array.isArray(relationToFields) &&
          relationToFields?.length > 0 && {
            relationToFields,
          }),
      }
    }
    case 'unsupported': {
      return null
    }
    default: {
      return {
        name,
        type: FieldTypes.Model,
      }
    }
  }
}

export const shouldInclude = (field: DMMF.Field) =>
  !excludedFields.includes(field.name)

export const getAdminSchema = (
  models: DMMF.Model[],
  enums: DMMF.DatamodelEnum[],
) => {
  try {
    const schema = models.map((model) => {
      const { fields, name } = model
      return {
        name,
        type: FieldTypes.Model,
        items: fields.filter(shouldInclude).map((field) => {
          const mappedField = getField(field, enums)
          if (mappedField?.type === FieldTypes.Related) {
            const mappedModel = models.find(
              (model) => model.name === mappedField?.modelName,
            )
            if (mappedModel && mappedModel.name !== model.name) {
              mappedField.items = mappedModel.fields
                .filter(shouldInclude)
                .map((field) => getField(field, enums))

              const foreignKeys = mappedField.items
                .filter(
                  (field) =>
                    field?.relationFromFields &&
                    field?.relationFromFields?.length > 0 &&
                    field?.relationToFields &&
                    field?.relationToFields?.length > 0,
                )
                .map((field) => {
                  if (field?.name) {
                    return {
                      [field.name]: {
                        from: field?.relationFromFields,
                        to: field?.relationToFields,
                      },
                    }
                  }
                  return null
                })

              if (foreignKeys?.find(Boolean)) {
                mappedField.foreignKeys = foreignKeys
              }
            }
          }
          return mappedField
        }),
      }
    })
    return schema
  } catch (error) {
    console.error(error)
  }
  return null
}
