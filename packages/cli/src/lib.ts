import fs from 'fs'
import Chance from 'chance'
import { JsonObject } from 'type-fest'
import execa from 'execa'
import type { Ora } from 'ora'
import { copySync, readJSONSync, pathExistsSync } from 'fs-extra'
import { resolveRelative, resolveRoot } from './utils'
import chalk from 'chalk'

const AST = require('abstract-syntax-tree')
const replaceInFiles = require('replace-in-files')
const { parse, stringify } = require('envfile')
const chance = new Chance()

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
  config?: JsonObject | null
}

interface PostProcessArgs {
  mainZone: string
  packageName: string
  port: number
  envFileNames: string[]
  nextConfigFileName: string
  zoneHost: string
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

const nextZoneUrlKey = (packageName: string) =>
  `ZONE_${packageName.replace('-', '_').toUpperCase()}_URL`

const postProcessNextEnv = (args: PostProcessArgs) => {
  try {
    args.envFileNames?.forEach((envFileName) => {
      console.log(`Updating ${args.mainZone}/${envFileName}...\n`)
      const envFile = fs.readFileSync(`${args.mainZone}/${envFileName}`, {
        encoding: 'utf8',
      })
      const env = stringify({
        ...parse(envFile),
        [nextZoneUrlKey(args.packageName)]: `${args.zoneHost}:${
          args.port || 0
        }`,
      })
      fs.writeFileSync(`${args.mainZone}/${envFileName}`, env, {
        encoding: 'utf8',
      })
    })
  } catch (error) {
    throw error
  }
}

const postProcessNextConfig = (args: PostProcessArgs) => {
  const postConfig = `[
    {
      source: "/${args.packageName}",
      destination: \`\${process.env.${nextZoneUrlKey(args.packageName)}\}/${
    args.packageName
  }\`,
    },
    {
      source: "/${args.packageName}/:path*",
      destination: \`\${process.env.${nextZoneUrlKey(args.packageName)}\}/${
    args.packageName
  }/:path*\`,
    },
  ]`

  const postConfigAstElements = AST.parse(postConfig).body.flatMap(
    (b: any) => b.expression.elements,
  )

  const source = fs.readFileSync(
    `${args.mainZone}/${args.nextConfigFileName}`,
    {
      encoding: 'utf8',
    },
  )

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

  fs.writeFileSync(`${args.mainZone}/${args.nextConfigFileName}`, code, {
    encoding: 'utf8',
  })
  console.log(
    'nextjs-zone: Updated main zone next.config.js\n',
    `${args.mainZone}/${args.nextConfigFileName}`,
  )
}

export const createProject = async (
  name: string,
  repo: string,
  spinner: Ora,
) => {
  try {
    spinner.start(`Cloning ${chalk.blue.bold(repo)}...`)

    await execa('git', [
      'clone',
      'git@github.com:strongly-labs/template-strong-project.git',
      name,
    ])

    spinner.succeed('Template cloned successfully')
  } catch (error) {
    spinner.fail('Failed to clone template repo ' + repo)
    throw error
  }

  try {
    spinner.start(`Post-processing ${chalk.blue.bold(name)}...`)

    // Post Processing - General
    await replaceInFiles({
      files: [`${name}/*`, `${name}/**/*`],
      from: /strong-user-org/gm,
      to: name,
    }).pipe({ from: /strong-new-package/gm, to: 'example' })

    spinner.succeed('Post-processed successfully')
  } catch (error) {
    spinner.fail('Post processing failed')
    throw error
  }

  try {
    spinner.start(`Installing dependencies... This can take a few minutes ⌛️`)

    process.chdir(name)

    await execa('yarn', ['install'])

    spinner.succeed('Dependencies installed successfully')
  } catch (error) {
    spinner.fail('Failed installing dependencies')
    throw error
  }

  try {
    spinner.start('Running post install scripts...')

    process.chdir(name)

    await execa('npx prisma', ['generate'])

    process.chdir(name)

    await execa('yarn', ['build'])

    process.chdir(name)

    await execa('npx', ['strong-js', 'link'])

    spinner.succeed('Project created successfuly!')

    console.log('Now you can cd into the directory and try:\n\n')

    console.log(chalk.green.bold('yarn up && yarn apps:dev\n\n'))
  } catch (error) {
    spinner.fail('Post install scripts failed')
    throw error
  }
  process.exit(1)
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
      const config = manifest?.config?.web as JsonObject
      const mainZone = resolveRoot(
        manifest.workspace.replace(
          '*',
          (config?.mainZoneName as string) || 'app-main',
        ),
      )
      const envFileNames = (config?.envFileNames as string[]) || ['.env.test']
      const zoneHost = (config?.zoneHost as string) || 'http://localhost'
      const nextConfigFileName =
        (config?.nextConfigFileName as string) || 'next.config.js'

      const postProcessArgs: PostProcessArgs = {
        mainZone,
        port,
        envFileNames,
        zoneHost,
        nextConfigFileName,
        packageName: manifest.name,
      }
      postProcessNextEnv(postProcessArgs)
      postProcessNextConfig(postProcessArgs)
    }

    return manifest
  } catch (error) {
    throw error
  }
}
