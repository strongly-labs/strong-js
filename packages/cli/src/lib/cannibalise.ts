/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, no-useless-catch */

import { readdirSync, readJson, writeJson } from 'fs-extra'

const replaceInFiles = require('replace-in-files')

export const cannibalise = async (name: string) => {
  try {
    const packages = readdirSync(`${name}/packages`)

    await replaceInFiles({
      files: [`${name}/apps/**/package.json`],
      from: /(?:"name": ")(@strong-js)(?:\/)/gm,
      to: `"name": "@${name}/`,
    })

    const pkg = await readJson(`${name}/package.json`)
    const { cli, linkLocal, postinstall, ...scripts } = pkg.scripts // eslint-disable-line @typescript-eslint/no-unused-vars
    const dependencies = packages.reduce(
      (acc, curr) => ({ ...acc, [`@strong-js/${curr}`]: 'latest' }),
      pkg.dependencies,
    )
    const postPkg = {
      ...pkg,
      name,
      scripts,
      dependencies,
    }

    return await writeJson(`${name}/package.json`, postPkg)
  } catch (error) {
    throw error
  }
}
