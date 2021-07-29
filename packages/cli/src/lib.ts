import fs from 'fs'
import { resolveRelative, resolveRoot } from './utils'
import { copySync, readJSONSync, pathExistsSync } from 'fs-extra'
const replaceInFiles = require('replace-in-files')
interface StrongLink {
  module: string
  operation: string
  from?: string
  to?: string
}

interface StrongConfig {
  links: StrongLink[]
}

interface AppManifest {
  name: string
  path: string
  config?: StrongConfig
}

interface PackageManifest {
  org: string
  name: string
  workspace: string
  template: string
}

export const safeLink = (from: string, to: string): boolean => {
  const fromExists = pathExistsSync(from)
  const toExists = pathExistsSync(to)

  if (toExists) {
    return false
  }

  if (!fromExists) {
    throw Error(`Source path ${from} does not exist`)
  }

  try {
    fs.symlinkSync(from, to, 'junction')
    return true
  } catch (error) {
    throw error
  }
}

export const copy = (from: string, to: string) => {
  const fromExists = pathExistsSync(from)

  if (!fromExists) {
    throw Error(`Source path ${from} does not exist`)
  }

  try {
    copySync(from, to)
  } catch (error) {
    throw error
  }
}

export const forApps = (callback: (app: AppManifest, error?: any) => void) => {
  const appsPath = resolveRoot('apps/web')
  fs.readdirSync(appsPath).forEach((name) => {
    const appDir = resolveRelative(appsPath, name)
    const path = fs.realpathSync(appDir)
    try {
      const config = readJSONSync(path + '/strong.json')

      callback({
        name,
        path,
        config,
      })
    } catch (error) {
      callback(
        {
          name,
          path,
        },
        error,
      )
    }
  })
}

export const createPackage = async (manifest: PackageManifest) => {
  try {
    const from = `${resolveRoot('packages/cli')}/templates/${manifest.template}`
    const to = manifest.workspace.replace('*', manifest.name)
    copy(from, to)
    await replaceInFiles({
      files: [`${to}/*`, `${to}/**/*`],
      from: /strong-user-org/gm,
      to: manifest.org,
    }).pipe({ from: /new-strong-package/gm, to: manifest.name })
    return manifest
  } catch (error) {
    throw error
  }
}
