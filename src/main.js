import { getError } from './error.js'
import { findVersion } from './find.js'
import { getOpts } from './options.js'

export { NODE_VERSION_FILES } from './load.js'

const importCache = new Map()

const getNodeVersionAlias = async () => {
  const key = 'node-version-alias'

  if (!importCache.has(key)) {
    const { default: nodeVersionAlias } = await import('node-version-alias')
    importCache.set(key, nodeVersionAlias)
  }

  return importCache.get(key)
}

const resolveVersion = async ({
  rawVersion,
  nodeVersionAliasOpts,
  filePath,
  envVariable,
}) => {
  const sanitizedRawVersion = (
    rawVersion.startsWith('v') ? rawVersion.slice(1) : rawVersion
  ).trim()

  // Check if rawVersion is in major.minor.revision format (all numbers)
  const isSemanticVersion = /^\d+\.\d+\.\d+$/u.test(sanitizedRawVersion)

  if (isSemanticVersion) {
    return {
      filePath,
      envVariable,
      rawVersion: sanitizedRawVersion,
      version: sanitizedRawVersion,
    }
  }

  try {
    const nodeVersionAlias = await getNodeVersionAlias()
    const version = await nodeVersionAlias(
      sanitizedRawVersion,
      nodeVersionAliasOpts,
    )
    return { filePath, envVariable, rawVersion: sanitizedRawVersion, version }
  } catch (error) {
    throw getError(error, filePath, envVariable)
  }
}

// Get the preferred Node.js version of a user or project by looking up its
// `.nvmrc` (or similar files) or `package.json` `engines.node`.
const preferredNodeVersion = async (opts) => {
  const { cwd, globalOpt, files, nodeVersionAliasOpts } = getOpts(opts)
  const { filePath, envVariable, rawVersion } = await findVersion({
    cwd,
    globalOpt,
    files,
  })

  if (rawVersion === undefined) {
    return {}
  }

  return resolveVersion({
    rawVersion,
    nodeVersionAliasOpts,
    filePath,
    envVariable,
  })
}

export default preferredNodeVersion
