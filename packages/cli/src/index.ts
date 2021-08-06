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
  .command('link <package-name>')
  .describe(
    'Link <package-name> with apps/* based on the config file strong.json',
  )
  .action(async (packageName: string) => {
    console.log(chalk.blue(logo))
    console.log(`Version: ${pkg.version}\n`)

    const spinner = ora(`Link apps`)

    linkPackage(packageName, spinner)
  })

prog.parse(process.argv)
