import { readFileSync, writeFileSync } from 'fs-extra'
import { astArrayPush } from '../utils'
import { PostProcessArgs } from './types'

const { parse, stringify } = require('envfile')

const nextZoneUrlKey = (packageName: string) =>
  `ZONE_${packageName.replace('-', '_').toUpperCase()}_URL`

export const postProcessNextEnv = (args: PostProcessArgs) => {
  try {
    args.envFileNames?.forEach((envFileName) => {
      console.log(`Updating ${args.mainZone}/${envFileName}...\n`)
      const envFile = readFileSync(`${args.mainZone}/${envFileName}`, {
        encoding: 'utf8',
      })
      const env = stringify({
        ...parse(envFile),
        [nextZoneUrlKey(args.packageName)]: `${args.zoneHost}:${
          args.port || 0
        }`,
      })
      writeFileSync(`${args.mainZone}/${envFileName}`, env, {
        encoding: 'utf8',
      })
    })
  } catch (error) {
    throw error
  }
}

export const postProcessNextConfig = (args: PostProcessArgs) => {
  const postConfig = `[
    {
      source: "/${args.packageName}",
      destination: \`\${process.env.${nextZoneUrlKey(args.packageName)}\}/${
    args.packageName
  }\`,
    },
    {
      source: "/${args.packageName}/:path*",
      destination: \`\${process.env.${nextZoneUrlKey(args.packageName)}\}/${
    args.packageName
  }/:path*\`,
    },
  ]`

  const source = readFileSync(`${args.mainZone}/${args.nextConfigFileName}`, {
    encoding: 'utf8',
  })

  const code = astArrayPush('rewrites', source, postConfig)

  writeFileSync(`${args.mainZone}/${args.nextConfigFileName}`, code, {
    encoding: 'utf8',
  })
  console.log(
    'nextjs-zone: Updated main zone next.config.js\n',
    `${args.mainZone}/${args.nextConfigFileName}`,
  )
}
