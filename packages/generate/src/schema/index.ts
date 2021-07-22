import * as fs from 'fs'
import * as path from 'path'
import superjson from 'superjson'
import { parseEnvValue } from '@prisma/sdk'
import { GeneratorOptions } from '@prisma/generator-helper'
import { getAdminSchema } from './lib'

export default async (options: GeneratorOptions): Promise<any> => {
  if (options.generator.output) {
    const outputDir =
      // This ensures previous version of prisma are still supported
      typeof options.generator.output === 'string'
        ? ((options.generator.output as unknown) as string)
        : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          parseEnvValue(options.generator.output)
    try {
      await fs.promises.mkdir(outputDir, {
        recursive: true,
      })
      const { models, enums } = options.dmmf.datamodel
      const adminSchema = getAdminSchema(models, enums)
      if (adminSchema) {
        await fs.promises.writeFile(
          path.join(outputDir, 'admin.json'),
          superjson.stringify(adminSchema),
        )
      }
    } catch (e) {
      console.error('Error: unable to write files for Prisma Schema Generator')
      throw e
    }
  } else {
    throw new Error('No output was specified for Prisma Schema Generator')
  }
}
