// import chalk from 'chalk'
// import ora from 'ora'
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

const createPackage = () => {
  // const spinner = ora(`Create Package`)
  // spinner.start()
  const suggestion: string = uniqueNamesGenerator(customConfig)

  const prompt = new Input({
    message: 'What would you like your package to be named',
    initial: suggestion,
  })

  prompt
    .run()
    .then((answer: any) => console.log('Answer:', answer))
    .catch(console.log)
}

export default createPackage
