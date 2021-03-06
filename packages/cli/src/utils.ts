/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import fs, { readJSONSync } from 'fs-extra'
import path from 'path'
import findWorkspaceRoot from 'find-yarn-workspace-root'
import { JsonObject, PackageJson } from 'type-fest'

const AST = require('abstract-syntax-tree')

export const resolveRoot = (relativePath: string) =>
  path.resolve(fs.realpathSync(process.cwd()), relativePath)

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

export const keyExists = (obj: Record<string, unknown>, prop: string) =>
  Object.prototype.hasOwnProperty.call(obj, prop)

export const astArrayPush = (
  variableName: string,
  source: string,
  addition: string,
): string => {
  const postConfigAstElements = AST.parse(addition).body.flatMap(
    (b: any) => b.expression.elements,
  )

  const tree = AST.parse(source)
  AST.replace(tree, (node: any) => {
    if (
      node.type === 'VariableDeclaration' &&
      node.declarations.find(
        (d: any) => keyExists(d.id, 'name') && d.id.name === variableName,
      )
    ) {
      node.declarations = node.declarations.flatMap((declaration: any) => {
        if (
          keyExists(declaration.id, 'name') &&
          declaration.id.name === variableName
        ) {
          declaration.init.elements = [
            ...declaration.init.elements,
            ...postConfigAstElements,
          ]
          return declaration
        }
      })
    }
    return node
  })
  return AST.generate(tree)
}
