import { expectAssignable, expectType } from 'tsd'

import preferredNodeVersion, {
  NODE_VERSION_FILES,
  type Options,
  type PreferredNodeVersion,
} from 'wallaby-preferred-node-version'

const result = await preferredNodeVersion()

await preferredNodeVersion({})
expectAssignable<Options>({})
// @ts-expect-error
await preferredNodeVersion(true)
// @ts-expect-error
await preferredNodeVersion({ unknown: true })

await preferredNodeVersion({ cwd: '.' })
expectAssignable<Options>({ cwd: '.' })
expectAssignable<Options>({ cwd: new URL('file://example.com') })
// @ts-expect-error
await preferredNodeVersion({ cwd: true })

await preferredNodeVersion({ global: true })
expectAssignable<Options>({ global: true })
// @ts-expect-error
await preferredNodeVersion({ global: 'true' })

await preferredNodeVersion({ files: ['path'] })
expectAssignable<Options>({ files: ['path'] })
// @ts-expect-error
await preferredNodeVersion({ files: 'path' })
// @ts-expect-error
await preferredNodeVersion({ files: [true] })

// @ts-expect-error
await preferredNodeVersion({ mirror: true })

// @ts-expect-error
await preferredNodeVersion({ signal: 'signal' })

// @ts-expect-error
await preferredNodeVersion({ fetch: 'true' })

expectType<PreferredNodeVersion>(result)

expectType<string[]>(NODE_VERSION_FILES)
