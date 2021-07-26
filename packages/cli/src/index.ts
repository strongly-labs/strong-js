#!/usr/bin/env node

import yargs from 'yargs'
import { promises as fs, constants } from 'fs'

const { access, realpath, symlink } = fs

async function linkStrongly(stronglyPath: string) {
  console.log('Attempting to create symlink to <ROOT_DIR>/.strongly')
  try {
    await access('./.strongly', constants.R_OK)
    console.log('.strongly dir alrealdy linked')
  } catch (handledError) {
    try {
      await symlink(stronglyPath, './.strongly', 'junction')
      console.log('linked .strongly dir')
    } catch (unhandledError) {
      throw unhandledError
    }
  }
}

async function linkAdmin(stronglyPath: string) {
  console.log(
    'Attempting to create symlink from <ROOT_DIR>/.strongly/api to pages/api/s',
  )
  const apiPath = './pages/api/s'
  try {
    await access(apiPath, constants.F_OK)
    console.log('strongly api alrealdy linked')
  } catch (handledError) {
    try {
      await symlink(stronglyPath + '/api', apiPath, 'junction')
      console.log('linked strongly api')
    } catch (unhandledError) {
      throw unhandledError
    }
  }
}

async function createLinks(modules: string[]) {
  try {
    const stronglyPath = await realpath('../../../.strongly')

    await linkStrongly(stronglyPath)

    if (modules.includes('admin')) {
      await linkAdmin(stronglyPath)
    }
  } catch (error) {
    throw error
  }
}

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
