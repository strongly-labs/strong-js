import glob from 'tiny-glob'
import { readJsonSync, realpathSync } from 'fs-extra'
import { resolveRoot } from '../utils'
import { AppManifest } from './types'

export const forApps = async (
  callback: (app: AppManifest, error?: any) => Promise<void>,
) => {
  const appsDir = resolveRoot('apps')
  const apps = await glob(`${appsDir}/*/*`)
  apps.forEach((name) => {
    const path = realpathSync(name)
    try {
      const config = readJsonSync(path + '/strong.json')

      void callback({
        name,
        path,
        config,
      })
    } catch (error) {
      void callback(
        {
          name,
          path,
        },
        error,
      )
    }
  })
}
