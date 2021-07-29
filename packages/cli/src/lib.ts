import fs from 'fs'
import Chance from 'chance'
import { copySync, readJSONSync, pathExistsSync } from 'fs-extra'
import { resolveRelative, resolveRoot } from './utils'

const AST = require('abstract-syntax-tree')
const replaceInFiles = require('replace-in-files')
const { parse, stringify } = require('envfile')

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

const chance = new Chance()
const zonesHost = 'http://localhost'
const mainZoneName = 'main'
const envFileName = '.env.test'
const nextConfigFileName = 'next.config.js'

const nextZoneUrlKey = (packageName: string) =>
  `ZONE_${packageName.replace('-', '_').toUpperCase()}_URL`

const postProcessNextEnv = (
  mainZone: string,
  packageName: string,
  port: number,
) => {
  try {
    const envFile = fs.readFileSync(`${mainZone}/${envFileName}`, {
      encoding: 'utf8',
    })
    const env = stringify({
      ...parse(envFile),
      [nextZoneUrlKey(packageName)]: `${zonesHost}:${port}`,
    })
    fs.writeFileSync(`${mainZone}/${envFileName}`, env, {
      encoding: 'utf8',
    })
    console.log(
      'nextjs-zone: Updated main zone env file\n',
      `${mainZone}/${envFileName}`,
    )
  } catch (error) {
    throw error
  }
}

const postProcessNextConfig = (mainZone: string, packageName: string) => {
  const postConfig = `[
    {
      source: "/${packageName}",
      destination: \`\${process.env.${nextZoneUrlKey(
        packageName,
      )}\}/${packageName}\`,
    },
    {
      source: "/${packageName}/:path*",
      destination: \`\${process.env.${nextZoneUrlKey(
        packageName,
      )}\}/${packageName}/:path*\`,
    },
  ]`

  const postConfigAstElements = AST.parse(postConfig).body.flatMap(
    (b: any) => b.expression.elements,
  )

  const source = fs.readFileSync(`${mainZone}/${nextConfigFileName}`, {
    encoding: 'utf8',
  })

  const tree = AST.parse(source)
  AST.replace(tree, (node: any) => {
    if (
      node.type === 'VariableDeclaration' &&
      node.declarations.find(
        (d: any) => d.id.hasOwnProperty('name') && d.id.name === 'rewrites',
      )
    ) {
      node.declarations = node.declarations.flatMap((declaration: any) => {
        if (
          declaration.id.hasOwnProperty('name') &&
          declaration.id.name === 'rewrites'
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
  const code = AST.generate(tree)

  fs.writeFileSync(`${mainZone}/${nextConfigFileName}`, code, {
    encoding: 'utf8',
  })
  console.log(
    'nextjs-zone: Updated main zone next.config.js\n',
    `${mainZone}/${nextConfigFileName}`,
  )
}

export const createPackage = async (manifest: PackageManifest) => {
  try {
    const from = `${resolveRoot('packages/cli')}/templates/${manifest.template}`
    const to = manifest.workspace.replace('*', manifest.name)
    const port = chance.integer({ min: 3000, max: 4000 })

    copy(from, to)

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
      const mainZone = resolveRoot(
        manifest.workspace.replace('*', mainZoneName),
      )
      postProcessNextEnv(mainZone, manifest.name, port)
      postProcessNextConfig(mainZone, manifest.name)
    }

    return manifest
  } catch (error) {
    throw error
  }
}
