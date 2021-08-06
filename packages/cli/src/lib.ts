import fs from 'fs'
import Chance from 'chance'
import execa from 'execa'
import glob from 'tiny-glob'
import chalk from 'chalk'
import {
  readJsonSync,
  writeJson,
  readJson,
  rename,
  copy,
  remove,
} from 'fs-extra'
import type { Ora } from 'ora'
import type { JsonObject } from 'type-fest'
import { astArrayPush, resolveRoot } from './utils'

const replaceInFiles = require('replace-in-files')
const { parse, stringify } = require('envfile')
const { promisify } = require('util')
const rimraf = promisify(require('rimraf'))

const chance = new Chance()

interface StrongConfig {
  packages: string[]
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

export const forApps = async (
  callback: (app: AppManifest, error?: any) => void,
) => {
  const appsDir = resolveRoot('apps')
  const apps = await glob(`${appsDir}/*/*`)
  apps.forEach((name) => {
    const path = fs.realpathSync(name)
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

  const source = fs.readFileSync(
    `${args.mainZone}/${args.nextConfigFileName}`,
    {
      encoding: 'utf8',
    },
  )

  const code = astArrayPush('rewrites', source, postConfig)

  fs.writeFileSync(`${args.mainZone}/${args.nextConfigFileName}`, code, {
    encoding: 'utf8',
  })
  console.log(
    'nextjs-zone: Updated main zone next.config.js\n',
    `${args.mainZone}/${args.nextConfigFileName}`,
  )
}

export const cannibalise = async (name: string) => {
  try {
    const packages = fs.readdirSync(`${name}/packages`)

    await replaceInFiles({
      files: [`${name}/apps/**/package.json`],
      from: /(?:"name": ")(@strong-js)(?:\/)/gm,
      to: `"name": "@${name}/`,
    })

    const pkg = await readJson(`${name}/package.json`)
    const { cli, linkLocal, postinstall, ...scripts } = pkg.scripts
    const dependencies = packages.reduce(
      (acc, curr) => ({ ...acc, [`@strong-js/${curr}`]: 'latest' }),
      pkg.dependencies,
    )
    const postPkg = {
      ...pkg,
      name,
      scripts,
      dependencies,
    }

    return await writeJson(`${name}/package.json`, postPkg)
  } catch (error) {
    throw error
  }
}

export const createProject = async (
  name: string,
  config: JsonObject | null,
  spinner: Ora,
) => {
  const repos = config?.repos as JsonObject

  if (repos.projectTemplate) {
    const repo = repos.projectTemplate as string
    const clone = async () => {
      try {
        spinner.start(`Cloning ${chalk.blue.bold(repo)}...`)

        await execa('git', [
          'clone',
          '--single-branch',
          '--branch',
          'main',
          repo,
          name,
        ])

        spinner.succeed('Template cloned successfully')
      } catch (error) {
        spinner.fail('Failed to clone template repo ' + repo)
        throw error
      }
    }

    const cannibaliseProject = async () => {
      try {
        spinner.start(`Cannibalising strong-js for ${chalk.blue.bold(name)}...`)

        await cannibalise(name)

        spinner.succeed('Cannibalised successfully')
      } catch (error) {
        spinner.fail('Cannibalisation failed')
        throw error
      }
    }

    const createExamplePackage = async () => {
      try {
        spinner.start(`Creating package ${chalk.blue.bold(name)}...`)

        await createPackage({
          org: name,
          name: 'example',
          template: 'strong-package',
          workspace: 'tmp/*',
        })

        await rimraf(`packages/*`)
        await copy('tmp/example', 'packages/example')
        await rimraf('tmp')

        spinner.succeed('Package packages/example created successfully')
      } catch (error) {
        spinner.fail('Package creation failed')
        throw error
      }
    }

    const prune = async () => {
      try {
        spinner.start(`Pruning files ${chalk.blue.bold(name)}...`)

        await rimraf('.git')
        await remove('.github/label.yml')

        const changesets = await glob(`${name}/.changeset/!(README).MD`)

        for (const changeset of changesets) {
          await remove(changeset)
        }

        spinner.succeed('Files pruned successfully')
      } catch (error) {
        spinner.fail('Failed to prune')
        throw console.error()
      }
    }

    const install = async () => {
      try {
        spinner.start(
          `Installing dependencies... This can take a few minutes ⌛️`,
        )

        await execa('yarn', ['install'])

        spinner.succeed('Dependencies installed successfully')
      } catch (error) {
        spinner.fail('Failed installing dependencies')
        throw error
      }
    }

    const postInstall = async () => {
      try {
        spinner.start('Running post install scripts...')

        await rename(`backend/.env.example`, `backend/.env`)
        await rename(
          `apps/web/app-main/.env.example`,
          `apps/web/app-main/.env.local`,
        )

        await rename(
          `apps/mobile/app-one/.env.example`,
          `apps/mobile/app-one/.env`,
        )

        await execa('yarn', ['data:gen'])
        await execa('yarn', ['build'])

        // Link packages
        await execa('npx', ['strong-js', 'link', '@strong-js/crud'])

        spinner.succeed('Project created successfuly!')

        console.log('Now you can cd into the directory and try:\n\n')

        console.log(chalk.green.bold('yarn up && yarn apps:dev\n\n'))
      } catch (error) {
        spinner.fail('Post install scripts failed')
        throw error
      }
    }

    await clone()
    await cannibaliseProject()

    // Set project dir as current working directory
    process.chdir(name)

    // Run inside project dir
    await createExamplePackage()
    await prune()
    await install()
    await postInstall()
  } else {
    spinner.fail(
      `Git repo for projectTemplate not found. Please add it to "repos" section of your root/strong.json`,
    )
  }

  process.exit(1)
}

export const createPackage = async (manifest: PackageManifest) => {
  try {
    const from = `${resolveRoot('packages/cli')}/templates/${manifest.template}`
    const to = manifest.workspace.replace('*', manifest.name)
    const port = chance.integer({ min: 3000, max: 4000 })

    await copy(from, to)

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
