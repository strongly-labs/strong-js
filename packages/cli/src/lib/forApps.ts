import glob from 'tiny-glob'
import { readJsonSync, realpathSync } from 'fs-extra'
import { resolveRoot } from 'packages/cli/dist/utils'
import { AppManifest } from './types'

export const forApps = async (
  callback: (app: AppManifest, error?: any) => void,
) => {
  const appsDir = resolveRoot('apps')
  const apps = await glob(`${appsDir}/*/*`)
  apps.forEach((name) => {
    const path = realpathSync(name)
    try {
      const config = readJsonSync(path + '/strong.json')

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
