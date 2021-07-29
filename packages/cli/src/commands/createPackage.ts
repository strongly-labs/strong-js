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

const customConfig: Config = {
  dictionaries: [adjectives, animals],
  style: 'lowerCase',
  separator: '-',
  length: 2,
}

const { Input } = require('enquirer')

const createPackage = (root: PackageJson | null) => {
  const spinner = ora(`Create Package`)
  spinner.start()

  if (!root) {
    spinner.fail('You can only run this command inside a strong-js project')
    return
  }

  spinner.succeed(`Workspace root ${chalk.green.bold(`@${root.name}`)}`)

  const suggestion: string = uniqueNamesGenerator(customConfig)
  const prompt = new Input({
    message: `Choose a package name ${chalk.blue.bold(`@${root.name}/`)}`,
    initial: `${suggestion}`,
  })

  prompt
    .run()
    .then((answer: any) => console.log('Answer:', answer))
    .catch(console.log)
}

export default createPackage
