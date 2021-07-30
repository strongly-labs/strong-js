import chalk from 'chalk'
import ora from 'ora'

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  animals,
} from 'unique-names-generator'
import { createProject } from '../lib'

const customConfig: Config = {
  dictionaries: [adjectives, animals],
  style: 'lowerCase',
  separator: '-',
  length: 2,
}

const { Input } = require('enquirer')

const init = async () => {
  const spinner = ora(`Create Strong Project`)

  const suggestion: string = uniqueNamesGenerator(customConfig)
  const namePrompt = new Input({
    message: `Choose a project name`,
    initial: `${suggestion}`,
  })

  try {
    const name = await namePrompt.run()
    spinner.start(`Creating ${chalk.blue.bold(name)} `)
    const success = await createProject(name)
    if (success) {
      spinner.succeed(`Package created successfully`)
    }
  } catch (error) {
    spinner.fail('Failed to create package')
    throw error
  }
}

export default init
