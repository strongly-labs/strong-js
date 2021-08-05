import sade from 'sade'
import chalk from 'chalk'
import ora from 'ora'

import { getRootConfig, getRootPackageJson } from './utils'
import create from './commands/create'
import logo from './logo'
import init from './commands/init'
import link from './commands/link'

const pkg = require('../package.json')

const prog = sade('strong-js')

prog
  .version(pkg.version)
  .command('create')
  .describe('Create a new strong-js package or app')
  .action(() => {
    console.log(chalk.blue(logo))
    console.log(`Version: ${pkg.version}\n`)
    const root = getRootPackageJson()
    const config = getRootConfig()
    create(root, config)
  })

prog
  .version(pkg.version)
  .command('init')
  .describe('Create a new strong-js project')
  .action(() => {
    console.log(chalk.blue(logo))
    console.log(`Version: ${pkg.version}\n`)
    const config = {
      repos: {
        projectTemplate: 'https://github.com/strongly-labs/strong-js.git',
      },
    }
    init(config)
  })

prog
  .version(pkg.version)
  .command('link <package-name>')
  .describe('Links root/* with apps/* based on the config file strong.json')
  .action(async (packageName: string) => {
    console.log(chalk.blue(logo))
    console.log(`Version: ${pkg.version}\n`)

    const spinner = ora(`Link apps`)

    link(packageName, spinner)
  })

prog.parse(process.argv)
