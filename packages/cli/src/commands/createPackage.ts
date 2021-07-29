import chalk from 'chalk'
// import chalk from 'chalk'
import ora from 'ora'
import { PackageJson } from 'type-fest'
// import { pathExistsSync, realpath } from 'fs-extra'

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  animals,
} from 'unique-names-generator'
import { getWorkspaceGlobs } from '../utils'

const customConfig: Config = {
  dictionaries: [adjectives, animals],
  style: 'lowerCase',
  separator: '-',
  length: 2,
}

const { Input, Select } = require('enquirer')

const createPackage = (root: PackageJson | null) => {
  const spinner = ora(`Create Package`)
  spinner.start()

  if (!root) {
    spinner.fail('You can only run this command inside a strong-js project')
    return
  }

  const paths = getWorkspaceGlobs(root)
  if (!paths) {
    spinner.fail('No workspaces found')
    return
  }

  spinner.succeed(`Workspace root ${chalk.green.bold(`@${root.name}`)}`)

  const suggestion: string = uniqueNamesGenerator(customConfig)
  const namePrompt = new Input({
    message: `Choose a package name ${chalk.blue.bold(`@${root.name}/`)}`,
    initial: `${suggestion}`,
  })

  const pathPrompt = new Select({
    name: 'path',
    message: 'Choose path',
    choices: paths,
  })

  namePrompt
    .run()
    .then((packageName: string) => {
      pathPrompt.run().then((path: string) => {
        console.log(
          `Creating ${chalk.blue.bold(
            `@${root.name}/${packageName}`,
          )} in ${path}`,
        )
      })
    })
    .catch(console.log)
}

export default createPackage
