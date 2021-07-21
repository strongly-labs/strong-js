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

export interface FormConfig {
  disabled?: string[]
  hidden?: string[]
}
