import fs from 'fs'
import { resolveRelative, resolveRoot } from './utils'
import { copySync, readJSONSync } from 'fs-extra'

// const { access, realpath, symlink } = fs

// async function linkStrongDir(stronglyPath: string) {
//   try {
//     await access('./.strong', constants.R_OK)
//   } catch (handledError) {
//     try {
//       await symlink(stronglyPath, './.strong', 'junction')
//     } catch (unhandledError) {
//       throw unhandledError
//     }
//   }
// }

// async function copyAdmin(stronglyPath: string) {
//   const apiPath = './pages/api/s'
//   try {
//     await copy(stronglyPath + '/api', apiPath)
//   } catch (unhandledError) {
//     throw unhandledError
//   }
// }

// export async function createLinks(modules: string[]) {
//   try {
//     const stronglyPath = await realpath('../../../.strong')

//     await linkStrongDir(stronglyPath)

//     if (modules.includes('admin')) {
//       await copyAdmin(stronglyPath)
//     }
//   } catch (error) {
//     throw error
//   }
// }

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
    fs.accessSync(to, fs.constants.R_OK)
    return false
  } catch (handledError) {
    try {
      fs.symlinkSync(to, from, 'junction')
      return true
    } catch (unhandledError) {
      throw unhandledError
    }
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
