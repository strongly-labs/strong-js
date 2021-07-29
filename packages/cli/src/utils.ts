import fs, { readJSONSync } from 'fs-extra'
import path from 'path'
import findWorkspaceRoot from 'find-yarn-workspace-root'
import { PackageJson } from 'type-fest'

export const rootDir = fs.realpathSync(process.cwd())

export const resolveRoot = (relativePath: string) =>
  path.resolve(rootDir, relativePath)

export const resolveRelative = (path1: string, path2: string) =>
  path.resolve(path1, path2)

export const getRootPackageJson = (): PackageJson | null => {
  const rootPath = findWorkspaceRoot()
  if (rootPath) {
    return readJSONSync(`${rootPath}/package.json`)
  }
  return null
}
