import { join } from 'node:path'

import test from 'ava'
import isPlainObj from 'is-plain-obj'

import {
  FIXTURES_DIR,
  runFixture,
  setEmptyHomeDir,
  unsetHomeDir,
} from './helpers/main.test.js'
import {
  ALIAS_VERSION,
  RESOLVED_VERSION_RANGE,
  TEST_VERSION,
  VERSION_RANGE,
} from './helpers/versions.test.js'

import preferredNodeVersion from 'wallaby-preferred-node-version'

test('Resolves aliases', async (t) => {
  const { version } = await runFixture('alias')
  t.is(version, ALIAS_VERSION)
})

test('Resolves version ranges', async (t) => {
  const { version } = await runFixture('version_range')
  t.is(version, RESOLVED_VERSION_RANGE)
})

test('Returns semantic versions directly without alias resolution', async (t) => {
  const { filePath, envVariable, rawVersion, version } =
    await runFixture('nvmrc')
  t.is(filePath, join(FIXTURES_DIR, 'nvmrc', '.nvmrc'))
  t.true(envVariable === undefined)
  t.is(rawVersion, TEST_VERSION)
  // Should be the same as rawVersion since it's semantic
  t.is(version, TEST_VERSION)
})

test('Returns information about the resolution', async (t) => {
  const { filePath, envVariable, rawVersion, version } =
    await runFixture('version_range')
  t.is(filePath, join(FIXTURES_DIR, 'version_range', '.nvmrc'))
  t.true(envVariable === undefined)
  t.is(rawVersion, VERSION_RANGE)
  t.is(version, RESOLVED_VERSION_RANGE)
})

test('resolveVersion handles non-semantic versions through alias resolution', async (t) => {
  // This test would need the actual alias resolution to work
  // since resolveVersion is not exported, we test it through preferredNodeVersion
  const { version } = await runFixture('alias')
  t.is(version, ALIAS_VERSION)
})

test('resolveVersion propagates errors from node-version-alias', async (t) => {
  // Create a fixture with an invalid alias that would cause node-version-alias to throw
  const error = await t.throwsAsync(
    preferredNodeVersion({
      cwd: join(FIXTURES_DIR, 'invalid_version'),
    }),
  )

  t.truthy(error)
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
