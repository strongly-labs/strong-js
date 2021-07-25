const fs = require('fs').promises

async function createLinks() {
  try {
    const target = await fs.realpath('../../../.strongly/api')
    const link = await fs.realpath('./pages/api')

    await fs.symlink(target, link + '/admin', 'junction')
  } catch (error) {
    throw error
  }
}

createLinks()
