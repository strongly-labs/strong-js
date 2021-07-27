#!/usr/bin/env node

'use strict'

try {
  require('../dist')
} catch (e) {
  console.log(
    '@strongly/generate binary not found, this is expected during first install',
  )
}
