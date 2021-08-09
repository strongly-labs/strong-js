import pkg from './package.json'
import { getRollupConfig } from '../../strong.rollup'

export default {
  input: './src/index.tsx',
  ...getRollupConfig(pkg.name),
}
