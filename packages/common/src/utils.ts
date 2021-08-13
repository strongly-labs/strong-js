/* eslint-disable  @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-return */

export const FieldTypes: Record<string, string> = {
  String: 'Text',
  DateTime: 'DateTime',
  Enum: 'Select',
  Related: 'Related',
  Reference: 'Reference',
  Model: 'Model',
}

export const fetcher = (url: string, options?: Partial<RequestInit>) =>
  fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).then((r) => r.json())

export const getIncludes = (schema: FormField | null | undefined) =>
  schema?.items
    ?.filter((item) => item?.type === FieldTypes.Related)
    ?.map((relatedItem) => relatedItem?.name)
    ?.filter(Boolean)

export const getQueryString = (params: any) =>
  Object.entries(params).reduce((acc, curr, index, arr) => {
    const [k, v] = curr
    if (k && v) {
      return acc + `${k}=${v}` + (index < arr.length - 1 ? '&' : '')
    }
    return acc
  }, '?')

export const mapForeignKeysWithData = (
  keys: FormField['foreignKeys'],
  data: any,
) =>
  keys
    ?.flatMap(
      (clause) =>
        (
          clause &&
          Object.entries(clause).flatMap(([_, { from, to }]) => {
            const mappedValues = to?.map((parentKey) => data[parentKey]) ?? null // eslint-disable-line  @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
            if (mappedValues) {
              return (
                from?.flatMap((key, index) => ({
                  [key]: mappedValues?.[index],
                })) ?? null
              )
            }
            return null
          })
        )?.filter(Boolean) ?? null,
    )
    ?.filter(Boolean)
    ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) // eslint-disable-line @typescript-eslint/no-unsafe-return

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const unCapitalize = (string: string) =>
  string.charAt(0).toLowerCase() + string.slice(1)
