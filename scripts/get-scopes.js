#!/usr/bin/env node

const fs = require('fs-extra')
const glob = require('tiny-glob')

const dirGlob = async (pathGlob) => {
  const packages = await glob(pathGlob, { filesOnly: true })

  const scopes = packages
    .map((p) => {
      try {
        const { name } = fs.readJsonSync(p)
        return name
      } catch (error) {
        console.warn(`No package.json found in ${p}`, error)
      }
    })
    .filter(Boolean)

  if (!scopes || scopes.length === 0) return ''

  if (packages.length === 1) {
    return scopes[0]
  }
  return `{${scopes.join(',')}}`
}

const pathGlob = process.argv.slice(2)
if (pathGlob.length > 0) {
  dirGlob(pathGlob[0]).then((globStr) => process.stdout.write(globStr))
} else {
  process.stderr.write('No path provided')
}
