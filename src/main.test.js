import { join } from 'node:path'

import test from 'ava'
import isPlainObj from 'is-plain-obj'

import {
  FIXTURES_DIR,
  runFixture,
  setEmptyHomeDir,
  unsetHomeDir,
} from './helpers/main.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

import preferredNodeVersion from 'wallaby-preferred-node-version'

test('Returns semantic versions directly without alias resolution', async (t) => {
  const { filePath, envVariable, rawVersion, version } =
    await runFixture('nvmrc')
  t.is(filePath, join(FIXTURES_DIR, 'nvmrc', '.nvmrc'))
  t.true(envVariable === undefined)
  t.is(rawVersion, TEST_VERSION)
  // Should be the same as rawVersion since it's semantic
  t.is(version, TEST_VERSION)
})

test.serial('Returns an empty object if nothing was found', async (t) => {
  setEmptyHomeDir()

  try {
    const result = await preferredNodeVersion({ cwd: '/' })
    t.true(isPlainObj(result))
    t.is(Object.keys(result).length, 0)
  } finally {
    unsetHomeDir()
  }
})
