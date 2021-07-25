const fs = require('fs').promises
const constants = require('fs').constants

const { access, realpath, symlink } = fs

async function linkStrongly(stronglyPath) {
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

async function linkApi(stronglyPath) {
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

async function createLinks() {
  try {
    const stronglyPath = await realpath('../../../.strongly')

    await linkStrongly(stronglyPath)
    await linkApi(stronglyPath)
  } catch (error) {
    throw error
  }
}

createLinks()
