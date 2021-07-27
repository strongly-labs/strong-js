#!/usr/bin/env node

import { generatorHandler } from '@prisma/generator-helper'
import generateApi from './api'
import generateSchema from './schema'

generatorHandler({
  onManifest() {
    return {
      defaultOutput: '.strong',
      prettyName: 'Prisma Strong-js Generator',
    }
  },
  async onGenerate(options) {
    await generateApi(options)
    await generateSchema(options)
  },
})
