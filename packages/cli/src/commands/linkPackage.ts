import { Ora } from 'ora'
import { ensureSymlink, pathExists } from 'fs-extra'
import { resolveRoot } from '../utils'
import { forApps } from '../lib'

const linkPackage = async (packageName: string, spinner: Ora) => {
  spinner.start(`Linking ${packageName}`)
  try {
    const { link } = require(`${packageName}/dist/support`)

    const fromPath = resolveRoot('.strong')
    const fromExists = await pathExists(fromPath)

    if (fromExists) {
      forApps(async (app, error) => {
        await ensureSymlink(fromPath, `${app.path}/.strong`, 'junction')

        if (!error) {
          if (app?.config?.packages?.includes(packageName)) {
            await link(fromPath, app.path)
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
