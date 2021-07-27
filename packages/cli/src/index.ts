import yargs from 'yargs'
import { promises as fs, constants } from 'fs'
import { copy } from 'fs-extra'

const { access, realpath, symlink } = fs

async function linkStrongly(stronglyPath: string) {
  console.log('Attempting to create symlink to <ROOT_DIR>/.strong')
  try {
    await access('./.strong', constants.R_OK)
    console.log('.strong dir alrealdy linked')
  } catch (handledError) {
    try {
      await symlink(stronglyPath, './.strong', 'junction')

      console.log('linked .strong dir')
    } catch (unhandledError) {
      throw unhandledError
    }
  }
}

async function copyAdmin(stronglyPath: string) {
  console.log('Attempting to copy <ROOT_DIR>/.strong/api to pages/api/s')
  const apiPath = './pages/api/s'
  try {
    await copy(stronglyPath + '/api', apiPath)
    console.log('copied strongly admin api')
  } catch (unhandledError) {
    throw unhandledError
  }
}

// async function linkAdmin(stronglyPath: string) {
//   console.log(
//     'Attempting to create symlink from <ROOT_DIR>/.strong/api to pages/api/s',
//   )
//   const apiPath = './pages/api/s'
//   try {
//     await access(apiPath, constants.F_OK)
//     console.log('strongly api alrealdy linked')
//   } catch (handledError) {
//     try {
//       await symlink(stronglyPath + '/api', apiPath, 'junction')
//       console.log('linked strongly admin api')
//     } catch (unhandledError) {
//       throw unhandledError
//     }
//   }
// }

async function createLinks(modules: string[]) {
  try {
    const stronglyPath = await realpath('../../../.strong')

    await linkStrongly(stronglyPath)

    if (modules.includes('admin')) {
      await copyAdmin(stronglyPath)
    }
  } catch (error) {
    throw error
  }
}

console.log(`

_____ _____ _____ _____ _____ _____ __    __ __
|   __|_   _| __  |     |   | |   __|  |  |  |  |
|__   | | | |    -|  |  | | | |  |  |  |__|_   _|
|_____| |_| |__|__|_____|_|___|_____|_____| |_|  


`)

yargs
  .scriptName('st')
  .usage('$0 <cmd> [args]')
  .command(
    'link [modules]',
    'link strongly with apps',
    (yargs: {
      positional: (
        arg0: string,
        arg1: { type: string; default: string; describe: string },
      ) => void
    }) => {
      yargs.positional('modules', {
        type: 'string',
        default: '',
        describe: 'the name to say hello to',
      })
    },
    function(argv: { modules: any }) {
      const modules = argv.modules.split(',')
      createLinks(modules)
    },
  )
  .help().argv
