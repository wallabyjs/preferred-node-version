import { findVersion } from './find.js'
import { getOpts } from './options.js'

export { NODE_VERSION_FILES } from './load.js'

const resolveVersion = ({ rawVersion, filePath, envVariable }) => {
  const sanitizedRawVersion = rawVersion.replaceAll(/[^\d.]/gu, '')

  const [major, minor, patch] = sanitizedRawVersion.split('.')

  if (major) {
    return {
      filePath,
      envVariable,
      rawVersion: sanitizedRawVersion,
      version: `${major}.${minor || '0'}.${patch || '0'}`,
    }
  }

  return {}
}

// Get the preferred Node.js version of a user or project by looking up its
// `.nvmrc` (or similar files) or `package.json` `engines.node`.
const preferredNodeVersion = async (opts) => {
  const { cwd, globalOpt, files } = getOpts(opts)
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
    filePath,
    envVariable,
  })
}

export default preferredNodeVersion
