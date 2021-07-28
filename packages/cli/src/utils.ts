import fs from 'fs-extra'
import path from 'path'

export const rootDir = fs.realpathSync(process.cwd())

export const resolveRoot = (relativePath: string) =>
  path.resolve(rootDir, relativePath)

export const resolveRelative = (path1: string, path2: string) =>
  path.resolve(path1, path2)
