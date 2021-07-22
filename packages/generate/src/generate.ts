#!/usr/bin/env node

import { generatorHandler } from '@prisma/generator-helper'
import generateApi from './api'
import generateSchema from './schema'

generatorHandler({
  onManifest() {
    return {
      defaultOutput: '.strongly',
      prettyName: 'Prisma Admin API Generator',
    }
  },
  async onGenerate(options) {
    await generateApi(options)
    await generateSchema(options)
  },
})
