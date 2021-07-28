import fs from 'fs'
import { resolveRelative, resolveRoot } from './utils'
import { copySync, readJSONSync, unlinkSync } from 'fs-extra'

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

export const safeLink = (from: string, to: string): boolean => {
  try {
    unlinkSync(from)
    fs.symlinkSync(to, from, 'junction')
    return true
  } catch (error) {
    throw error
  }
}

export const copy = (from: string, to: string) => {
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
