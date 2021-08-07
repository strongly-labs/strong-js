import Chance from 'chance'
import { copy } from 'fs-extra'
import type { JsonObject } from 'type-fest'
import { resolveRoot } from '../utils'
import { postProcessNextConfig, postProcessNextEnv } from './postProcess'
import { PackageManifest, PostProcessArgs } from './types'

const replaceInFiles = require('replace-in-files')

const chance = new Chance()

export const createPackage = async (manifest: PackageManifest) => {
  try {
    const from = `${resolveRoot('packages/cli')}/templates/${manifest.template}`
    const to = manifest.workspace.replace('*', manifest.name)
    const port = chance.integer({ min: 3000, max: 4000 })

    await copy(from, to)

    // Post Processing - General
    await replaceInFiles({
      files: [`${to}/*`, `${to}/**/*`],
      from: /strong-user-org/gm,
      to: manifest.org,
    })
      .pipe({ from: /strong-new-package/gm, to: manifest.name })
      .pipe({ from: /strong-port/gm, to: port })

    // Post Processing - Web
    if (manifest.template === 'nextjs-zone') {
      const config = manifest?.config?.web as JsonObject
      const mainZone = resolveRoot(
        manifest.workspace.replace(
          '*',
          (config?.mainZoneName as string) || 'app-main',
        ),
      )
      const envFileNames = (config?.envFileNames as string[]) || ['.env.test']
      const zoneHost = (config?.zoneHost as string) || 'http://localhost'
      const nextConfigFileName =
        (config?.nextConfigFileName as string) || 'next.config.js'

      const postProcessArgs: PostProcessArgs = {
        mainZone,
        port,
        envFileNames,
        zoneHost,
        nextConfigFileName,
        packageName: manifest.name,
      }
      postProcessNextEnv(postProcessArgs)
      postProcessNextConfig(postProcessArgs)
    }

    return manifest
  } catch (error) {
    throw error
  }
}
