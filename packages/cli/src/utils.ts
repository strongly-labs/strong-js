import fs, { readJSONSync } from 'fs-extra'
import path from 'path'
import findWorkspaceRoot from 'find-yarn-workspace-root'
import { JsonObject, PackageJson } from 'type-fest'

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

export const getRootConfig = (): JsonObject | null => {
  const rootPath = findWorkspaceRoot()
  if (rootPath) {
    return readJSONSync(`${rootPath}/strong.json`)
  }
  return null
}

export const getWorkspaceGlobs = (root: PackageJson): string[] | null => {
  if (Array.isArray(root.workspaces)) {
    return root.workspaces
  } else if (root.workspaces?.packages) {
    return root.workspaces?.packages
  }
  return null
}
