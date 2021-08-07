import * as fs from 'fs'
import * as path from 'path'
import { parseEnvValue } from '@prisma/sdk'
import { GeneratorOptions } from '@prisma/generator-helper'
import { getResourceName, nextCrudApiTemplate } from './apiTemplate'

export const unCapitalize = (string: string) =>
  string.charAt(0).toLowerCase() + string.slice(1)

export default async (options: GeneratorOptions): Promise<any> => {
  if (options.generator.output) {
    const outputDir =
      // This ensures previous version of prisma are still supported
      typeof options.generator.output === 'string'
        ? ((options.generator.output as unknown) as string)
        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          parseEnvValue(options.generator.output)
    try {
      const apiDir = outputDir + '/api'
      await fs.promises.mkdir(apiDir, {
        recursive: true,
      })
      const { models } = options.dmmf.datamodel
      void (await Promise.all(
        models.map(async (model) => {
          const resourceName = getResourceName(model.name)
          const resourceDir = apiDir + '/' + resourceName
          await fs.promises.mkdir(resourceDir, {
            recursive: true,
          })

          await fs.promises.writeFile(
            path.join(resourceDir, `[[...${resourceName}]].ts`),
            nextCrudApiTemplate(resourceName, unCapitalize(model.name)),
          )
        }),
      ))
    } catch (e) {
      console.error('Error: unable to write files for Prisma Schema Generator')
      throw e
    }
  } else {
    throw new Error('No output was specified for Prisma Schema Generator')
  }
}
