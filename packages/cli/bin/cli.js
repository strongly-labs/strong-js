#!/usr/bin/env node

'use strict'

try {
  require('../dist')
} catch (e) {
  console.log(
    '@strong-js/cli binary not found, this is expected during first install',
  )
}
