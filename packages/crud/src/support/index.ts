/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
export const link = async (strongDir: string, appDir: string) => {
  if (typeof window === 'undefined') {
    const fs = require('fs-extra')
    await fs.copy(`${strongDir}/api`, `${appDir}/pages/api/s`)
  }
}
