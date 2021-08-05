import { Ora } from 'ora'
import { pathExists } from 'fs-extra'
import { resolveRoot } from '../utils'

const link = async (packageName: string, spinner: Ora) => {
  spinner.start(`Linking ${packageName}`)

  try {
    const { link } = require(packageName)
    const fromPath = resolveRoot('.strong')
    const fromExists = await pathExists(fromPath)

    if (fromExists) {
      await link(fromPath, 'apps/web')
      spinner.succeed(`${packageName} linked successfully`)
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

export default link
