#!/usr/bin/env node

const fs = require('fs-extra')

const rootPackageJson = fs.readJSONSync('./package.json')

const dirGlob = (path) => {
  const packages = fs.readdirSync(path)

  if (packages.length === 1) {
    return `@${rootPackageJson.name}/${packages[0]}`
  }

  const list = packages.map((p) => `@${rootPackageJson.name}/${p}`).join(',')
  return `{${list}}`
}

const path = process.argv.slice(2)
if (path.length > 0) {
  const glob = dirGlob(path[0])
  process.stdout.write(glob)
} else {
  process.stderr.write('No path provided')
}
