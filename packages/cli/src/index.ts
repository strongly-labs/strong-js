/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-floating-promises */

import sade from 'sade'
import chalk from 'chalk'
import ora from 'ora'

import { getRootConfig, getRootPackageJson } from './utils'
import create from './commands/create'
import logo from './logo'
import init from './commands/init'
import linkPackage from './commands/linkPackage'

const pkg = require('../package.json')

const prog = sade('strong-js')

const buildConfig = {
  repos: {
    projectTemplate: {
      url: 'https://github.com/strongly-labs/strong-js.git',
      branch: 'main',
    },
  },
}

prog
  .version(pkg.version)
  .command('create')
  .describe('Create a new strong-js package or app')
  .action(() => {
    console.log(chalk.blue(logo))
    console.log(`Version: ${pkg.version}\n`)
    const root = getRootPackageJson()
    const rootConfig = getRootConfig()
    create(root, rootConfig)
  })

prog
  .version(pkg.version)
  .command('init')
  .describe('Create a new strong-js project')
  .action(() => {
    console.log(chalk.blue(logo))
    console.log(`Version: ${pkg.version}\n`)

    init(buildConfig)
  })

prog
  .version(pkg.version)
  .command('link')
  .option('-P, --packageName', 'name of the package to be linked')
  .describe('Link packages with apps/* based on the config file strong.json')
  .action(async (options: Record<string, string>) => {
    console.log(chalk.blue(logo))
    console.log(`Version: ${pkg.version}\n`)

    const spinner = ora(`Link apps`)
    const { packageName } = options

    await linkPackage(packageName || '', spinner)
  })

prog.parse(process.argv)
