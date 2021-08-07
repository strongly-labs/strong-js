import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const rimraf = promisify(require('rimraf'))

const extensions = ['.js', '.jsx', '.ts', '.tsx']
const formats = ['cjs', 'esm']

const dist = path.resolve(fs.realpathSync(process.cwd()), 'dist')

const cleanPackageName = (name) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, '')

const external = (id) => !id.startsWith('.') && !path.isAbsolute(id)

const defaults = {
  freeze: false,
  esModule: true,
  globals: { react: 'React', 'react-native': 'ReactNative' },
  exports: 'named',
}

export const clearDist = (options = {}) => {
  const { hook = 'buildStart' } = options

  return {
    name: 'clear-dist',
    [hook]: async () => {
      try {
        if (fs.existsSync(dist)) {
          await rimraf(dist)
          fs.mkdirSync(dist)
        }
      } catch (error) {
        throw error
      }
    },
  }
}

export const writeEntryFile = (options = {}) => {
  const {
    moduleName = '',
    bundleName = 'index.js',
    bin = false,
    hook = 'buildEnd',
  } = options

  const baseLine = `module.exports = require('./${moduleName}`
  const contents = `${bin ? '#!/usr/bin/env node' : ''}

'use strict'
if (process.env.NODE_ENV === 'production') {
  ${baseLine}.cjs.min.js')
} else {
  ${baseLine}.cjs.js')
}
`
  return {
    name: 'write-entry-file',
    [hook]: async () => {
      try {
        fs.writeFileSync(path.join(dist, bundleName), contents, {
          ...(bin && { mode: 0o755 }),
        })
        return Promise.resolve()
      } catch (error) {
        throw error
      }
    },
  }
}

export const getOutputFormats = (name) => {
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
        sourcemap: true,
        ...defaults,
      })
    }
  })
  return outputs
}

export const getRollupConfig = (
  packageName,
  bin = false,
  bundleName = 'index.js',
  cjsOptions = {},
) => {
  const moduleName = cleanPackageName(packageName)
  return {
    external: (id) => {
      if (id.startsWith('regenerator-runtime')) {
        return false
      }

      return external(id)
    },
    plugins: [
      resolve({ extensions }),
      commonjs(cjsOptions),
      json(),
      babel({
        extensions,
        babelHelpers: 'bundled',
      }),
      writeEntryFile({
        moduleName,
        bundleName,
        bin,
      }),
    ],
    output: getOutputFormats(moduleName),
  }
}
