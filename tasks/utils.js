const argv = require('yargs').argv
const os = require('os')

exports.os = function() {
  switch (os.platform()) {
    case 'darwin':
      return 'osx'
    case 'linux':
      return 'linux'
    case 'win32':
      return 'windows'
  }
  return 'unsupported'
}

exports.replace = function(str, patterns) {
  Object.keys(patterns).forEach(pattern => {
    const matcher = new RegExp(`{{${pattern}}}`, 'g')
    str = str.replace(matcher, patterns[pattern])
  })
  return str
}

exports.convertToRtf = function(plain) {
  plain = plain.replace(/\n/g, '\\par\n')
  return `{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang2057{\\fonttbl{\\f0\\fnil\\fcharset0 Microsoft Sans Serif;}}\n\\viewkind4\\uc1\\pard\\f0\\fs17 ${plain}\\par\n}`
}

exports.getEnvName = function() {
  return argv.env || 'development'
}

exports.getSigningId = function() {
  return argv.thumbprint
}

// Fixes https://github.com/nodejs/node-v0.x-archive/issues/2318
exports.spawnablePath = function(path) {
  if (process.platform === 'win32') {
    return `${path}.cmd`
  }
  return path
}

exports.finalPackageName = function(manifest, extention) {
  const name = manifest.name
  const version = manifest.version
  return `${name}-${version}.${extention}`
}

exports.isMas = function() {
  return argv.mas
}
