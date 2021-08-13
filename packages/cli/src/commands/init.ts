/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

import { createProject } from '../lib'
import ora from 'ora'

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  animals,
} from 'unique-names-generator'
import { JsonObject } from 'type-fest'

const customConfig: Config = {
  dictionaries: [adjectives, animals],
  style: 'lowerCase',
  separator: '-',
  length: 2,
}

const { Input } = require('enquirer')

const init = async (config: JsonObject | null) => {
  const spinner = ora(`Create Strong Project`)

  const suggestion: string = uniqueNamesGenerator(customConfig)
  const namePrompt = new Input({
    message: `Choose a project name`,
    initial: `${suggestion}`,
  })

  try {
    const name = await namePrompt.run()
    await createProject(name, config, spinner)
    spinner.succeed(`Package created successfully`)
  } catch (error) {
    spinner.fail('Failed to create package')
    throw error
  }
}

export default init
