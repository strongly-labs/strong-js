import pkg from './package.json'
import { getRollupConfig } from '../../strong.rollup'

const moduleConfig = getRollupConfig(pkg.name)

export default [
  {
    input: './src/index.tsx',
    ...moduleConfig,
  },
]
