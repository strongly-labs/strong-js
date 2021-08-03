import pkg from './package.json'
import { getRollupConfig } from '../../strong.rollup'

export default {
  input: './src/index.ts',
  ...getRollupConfig(pkg.name, true),
}
