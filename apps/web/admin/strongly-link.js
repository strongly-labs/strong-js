const fs = require('fs').promises

async function createLinks() {
  try {
    const target = await fs.realpath('../../../.strongly')

    await fs.symlink(target, './.strongly', 'junction')
  } catch (error) {
    throw error
  }
}

createLinks()
