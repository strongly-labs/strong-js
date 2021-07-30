import sade from 'sade'
import chalk from 'chalk'
import ora from 'ora'

import { copy, forApps, safeLink } from './lib'
import { getRootConfig, getRootPackageJson, resolveRoot } from './utils'
import create from './commands/create'
import logo from './logo'

const pkg = require('../package.json')

const prog = sade('strong')

prog
  .version(pkg.version)
  .command('create')
  .describe('Create a new strong-js package or app')
  .action(() => {
    console.log(chalk.blue(logo))
    const root = getRootPackageJson()
    const config = getRootConfig()
    create(root, config)
  })

prog
  .version(pkg.version)
  .command('link')
  .describe('Links .strong/* with apps/* based on the config file strong.json')
  .action(async () => {
    console.log(chalk.blue(logo))
    const spinner = ora(`Link apps`)

    const fromPath = resolveRoot('.strong')
    forApps((app, error) => {
      if (app?.config?.links) {
        try {
          app.config.links.forEach((link) => {
            const from = link.from ? fromPath + '/' + link.from : fromPath
            const to = link.to ? app.path + '/' + link.to : app.path

            switch (link.operation) {
              case 'link': {
                spinner.text = `${app.name}: Linking with module: "${link.module}"`

                const linked = safeLink(from, to)

                if (linked) {
                  spinner.succeed(
                    `${app.name}: Successfully linked with "${link.module}"`,
                  )
                } else {
                  spinner.info(
                    `${app.name}: Aleady linked with "${link.module}"`,
                  )
                }

                break
              }
              case 'copy': {
                copy(from, to)

                spinner.succeed(
                  `${app.name}: Successfully copied "${link.module}"`,
                )
                break
              }
              default: {
                spinner.fail(
                  `${app.name}: Link definition does not have a valid operation type - supported operation types: [SYMLINK, COPY]`,
                )
              }
            }
          })
        } catch (error) {
          spinner.fail(`${app.name}: Linking failed - ${error.message}`)
        }
      } else if (error) {
        spinner.info(`${app.name}: no strong.json found, skipping`)
      }
    })
  })

prog.parse(process.argv)
