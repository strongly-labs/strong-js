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
import { createPackage } from '../lib'
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

const getworkspaceChoice = (path: string) => {
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

  if (!root || !root.name) {
    spinner.fail('You can only run this command inside a strong-js project')
    return
  }

  const workspaces = getWorkspaceGlobs(root)
  if (!workspaces) {
    spinner.fail('No workspaces found')
    return
  }

  spinner.succeed(`Workspace root ${chalk.green.bold(`@${root.name}`)}`)

  const suggestion: string = uniqueNamesGenerator(customConfig)
  const namePrompt = new Input({
    message: `Choose a package name ${chalk.blue.bold(`@${root.name}/`)}`,
    initial: `${suggestion}`,
  })

  const workspacePrompt = new Select({
    name: 'workspace',
    message: 'Choose workspace',
    choices: workspaces.map(getworkspaceChoice),
  })

  try {
    const name = await namePrompt.run()
    const workspace = await workspacePrompt.run()
    const { template } = getPackageInfo(workspace)

    const confirmPrompt = new Confirm({
      name: 'confirm-create',
      message: `About to create:

${chalk.blue.bold('Package')}: @${root.name}/${name}
${chalk.blue.bold('Template')}: ${template}
${chalk.blue.bold('workspace')}: ${workspace}

- Proceed?`,
    })

    const confirm = await confirmPrompt.run()

    if (confirm) {
      try {
        spinner.start(`Creating ${chalk.blue.bold(`@${root.name}/${name}`)} `)
        const manifest = await createPackage({
          org: root.name,
          name,
          workspace,
          template,
        })
        spinner.succeed(`Package created successfully`)
        console.log('Manifest', manifest)
      } catch (error) {
        spinner.fail('Failed to create package')
        throw error
      }
    }
  } catch (error) {
    spinner.fail('Failed to create package')
    throw error
  }
}

export default create
