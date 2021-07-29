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

const { Input, Select, Confirm } = require('enquirer')

const getPackageInfo = (path: string) => {
  let hint, template
  if (path.startsWith('apps/web')) {
    hint = 'Creates a NextJS'
    template = 'nextjs-zone'
  } else if (path.startsWith('apps/mobile')) {
    hint = 'Creates a React Native app'
    template = 'react-native-app'
  } else {
    hint = 'Creates a generic package'
    template = 'strong-package'
  }
  return {
    hint,
    template,
  }
}

const getPathChoice = (path: string) => {
  const { hint } = getPackageInfo(path)
  return {
    name: path,
    message: path,
    value: path,
    hint,
  }
}

const create = async (root: PackageJson | null) => {
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
    choices: paths.map(getPathChoice),
  })

  try {
    const name = await namePrompt.run()
    const path = await pathPrompt.run()

    const confirmPrompt = new Confirm({
      name: 'confirm-create',
      message: `About to create:
${chalk.blue.bold('Package')}: @${root.name}/${name}
${chalk.blue.bold('Template')}: ${getPackageInfo(path).template}
${chalk.blue.bold('Path')}: ${path}
- Proceed?`,
    })

    const confirm = await confirmPrompt.run()

    console.log(confirm)
  } catch (error) {
    spinner.fail(`Failed to create package`)
    throw error
  }
}

export default create
