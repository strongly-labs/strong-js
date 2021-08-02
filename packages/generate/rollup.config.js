import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'

const path = require('path')
const fs = require('fs')
const extensions = ['.js', '.jsx', '.ts', '.tsx']
const formats = ['cjs', 'esm']

const dist = path.resolve(fs.realpathSync(process.cwd()), 'dist')

const entryName = (name) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')

const external = (id) => !id.startsWith('.') && !path.isAbsolute(id)

const defaults = {
  freeze: false,
  esModule: true,
  sourcemap: true,
  globals: { react: 'React', 'react-native': 'ReactNative' },
  exports: 'named',
}

const writeEntryFile = (options = {}) => {
  const { moduleName = '', bin = false, hook = 'buildEnd' } = options

  const baseLine = `module.exports = require('./${moduleName}`
  const contents = `${bin && '#!/usr/bin/env node'}

'use strict'
if (process.env.NODE_ENV === 'production') {
  ${baseLine}.cjs.min.js')
} else {
  ${baseLine}.cjs.js')
}
`
  return {
    name: 'write-entry-file',
    [hook]: async () => fs.writeFileSync(path.join(dist, 'index.js'), contents),
  }
}

const getOutputFormats = (name) => {
  const outputs = []

  formats.forEach((format) => {
    outputs.push({
      name,
      format,
      file: `${dist}/${name}.${format}.js`,
      ...defaults,
    })
    if (format === 'cjs') {
      outputs.push({
        name,
        format,
        file: `${dist}/${name}.cjs.min.js`,
        plugins: [terser()],
        ...defaults,
      })
    }
  })
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
    }),
    writeEntryFile({
      moduleName: entryName(pkg.name),
      bin: true,
    }),
  ],
  output: getOutputFormats(entryName(pkg.name)),
}
