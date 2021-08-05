import { copy } from 'fs-extra'
export const link = async (strongDir: string, appDir: string) => {
  await copy(`${strongDir}/api`, `${appDir}/pages/api/s`)
}
