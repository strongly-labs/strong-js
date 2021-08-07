export const link = async (strongDir: string, appDir: string) => {
  if (typeof window === 'undefined') {
    const { copy } = require('fs-extra')
    await copy(`${strongDir}/api`, `${appDir}/pages/api/s`)
  }
}
