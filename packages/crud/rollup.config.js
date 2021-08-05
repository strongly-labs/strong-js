import pkg from './package.json'
import { getRollupConfig } from '../../strong.rollup'

const mainBundleConfig = getRollupConfig(pkg.name)

const serverBundleConfig = getRollupConfig(
  `${pkg.name}-server`,
  false,
  'server.js',
)

const supportBundleConfig = getRollupConfig(
  `${pkg.name}-support`,
  false,
  'support.js',
)

export default [
  {
    input: './src/index.tsx',
    ...mainBundleConfig,
  },
  {
    input: './src/support',
    ...supportBundleConfig,
  },
  {
    input: './src/server',
    ...serverBundleConfig,
  },
]
