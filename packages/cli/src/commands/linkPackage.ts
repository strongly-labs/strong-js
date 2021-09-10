/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-floating-promises, @typescript-eslint/no-unsafe-call */

import { Ora } from 'ora'
import { ensureSymlink, pathExists } from 'fs-extra'
import { resolveRoot } from '../utils'
import { forApps } from '../lib'

interface Support {
  link(from: string, app: string): Promise<void>
}

const linkPackage = async (packageName: string, spinner: Ora) => {
  spinner.start()
  try {
    const fromPath = resolveRoot('.strong')
    const fromExists = await pathExists(fromPath)

    if (fromExists) {
      forApps(async (app, error) => {
        void (await ensureSymlink(fromPath, `${app.path}/.strong`, 'junction'))

        if (packageName.length > 0) {
          if (!error) {
            if (app?.config?.packages?.includes(packageName)) {
              spinner.start(`Linking ${packageName}`)

              const support: Support = require(`${packageName}/dist/support`)

              void (await support.link(fromPath, app.path))
              spinner.succeed(
                `${packageName} linked with ${app.name} successfully`,
              )
            } else {
              spinner.info(
                `${packageName} does not need to be linked with ${app.name}`,
              )
            }
          } else {
            spinner.fail(
              `Linking failed: ${packageName} could not be linked with ${app.name}:${app.path}`,
            )
          }
        } else {
          spinner.succeed(`${app.name} linked successfully`)
        }
      })
    } else {
      spinner.fail(
        `Linking failed for ${packageName}, couldn't find .strong directory in your workspace root.`,
      )
    }
  } catch (error) {
    spinner.fail(
      `Failed to import ${packageName}, please ensure the package exists and supports linking.`,
    )
  }
}

export default linkPackage
