import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import pkg from './package.json'

const path = require('path')
const fs = require('fs')

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const formats = ['cjs', 'es', 'umd', 'system']

export const rootDir = fs.realpathSync(process.cwd())

export const resolveRoot = (relativePath) => path.resolve(rootDir, relativePath)

export const safePackageName = (name) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')

export const external = (id) => !id.startsWith('.') && !path.isAbsolute(id)

const defaults = {
  freeze: false,
  esModule: true,
  sourcemap: true,
  globals: { react: 'React', 'react-native': 'ReactNative' },
  exports: 'named',
}

function getOutputs() {
  const dist = resolveRoot('dist')
  const outputs = []
  if (pkg.main) {
    outputs.push({
      name: `${dist}/${safePackageName(pkg.name)}`,
      file: pkg.main,
      format: 'cjs',
      ...defaults,
    })
  }

  if (pkg.module) {
    outputs.push({
      name: `${dist}/${safePackageName(pkg.name)}`,
      file: pkg.module,
      format: 'es',
      ...defaults,
    })
  }

  return outputs
}

export default {
  input: './src/index.ts',

  external: (id) => {
    if (id.startsWith('regenerator-runtime')) {
      return false
    }

    return external(id)
  },
  plugins: [
    resolve({ extensions }),
    commonjs(),
    json(),
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
  ],

  output: getOutputs(),
}
