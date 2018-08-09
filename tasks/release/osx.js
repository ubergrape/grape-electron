const Q = require('q') // eslint-disable-line import/no-extraneous-dependencies
const gulpUtil = require('gulp-util') // eslint-disable-line import/no-extraneous-dependencies
const jetpack = require('fs-jetpack') // eslint-disable-line import/no-extraneous-dependencies
const asar = require('asar') // eslint-disable-line import/no-extraneous-dependencies
const childProcess = require('child_process') // eslint-disable-line import/no-extraneous-dependencies
const sign = require('electron-osx-sign') // eslint-disable-line import/no-extraneous-dependencies
const download = require('electron-download') // eslint-disable-line import/no-extraneous-dependencies
const extract = require('extract-zip') // eslint-disable-line import/no-extraneous-dependencies
const semver = require('semver') // eslint-disable-line import/no-extraneous-dependencies
const path = require('path')

const utils = require('../utils')

let projectDir
let releasesDir
let tmpDir
let distDir
let finalAppDir
let manifest
let electronVersion

const init = () => {
  projectDir = jetpack
  tmpDir = projectDir.dir('./tmp', { empty: true })
  distDir = tmpDir.dir('./dist', { empty: true })
  releasesDir = projectDir.dir('./releases')
  manifest = projectDir.read('app/package.json', 'json')
  electronVersion = projectDir.read('package.json', 'json').devDependencies
    .electron
  electronVersion = semver.clean(electronVersion.replace(/^[^0-9]+/, ''))
  finalAppDir = tmpDir.cwd(`${manifest.productName}.app`)

  return Q()
}

const downloadRuntime = () => {
  const deferred = Q.defer()

  // If it is not for mas, it has been already downloaded during installation.
  if (!utils.isMas()) {
    deferred.resolve()
    return deferred.promise
  }

  gulpUtil.log(
    'Downloading MAS build version',
    electronVersion,
    'to',
    distDir.path(),
  )

  function extractFile(err, zipPath) {
    if (err) return deferred.reject(err)
    gulpUtil.log('Extracting from', zipPath)
    const options = {
      dir: distDir.path(),
    }
    extract(zipPath, options, error => {
      if (error) return deferred.reject(error)
      deferred.resolve()
      return false
    })
    return false
  }

  download(
    {
      version: electronVersion,
      platform: 'mas',
      arch: process.env.npm_config_arch,
      strictSSL: process.env.npm_config_strict_ssl === 'true',
      quiet:
        ['info', 'verbose', 'silly', 'http'].indexOf(
          process.env.npm_config_loglevel,
        ) === -1,
    },
    extractFile,
  )

  return deferred.promise
}

const copyRuntime = () => {
  let dist = 'node_modules/electron/dist'
  if (utils.isMas()) dist = distDir.path()
  const source = path.join(dist, 'Electron.app')
  const dest = finalAppDir.path()
  gulpUtil.log('Copy build from', source, 'to', dest)
  return projectDir.copyAsync(source, dest)
}

const cleanupRuntime = () => {
  finalAppDir.remove('Contents/Resources/default_app')
  finalAppDir.remove('Contents/Resources/atom.icns')
  return Q()
}

const packageBuiltApp = () => {
  const deferred = Q.defer()

  asar.createPackage(
    projectDir.path('build'),
    finalAppDir.path('Contents/Resources/app.asar'),
    () => {
      deferred.resolve()
    },
  )

  return deferred.promise
}

const finalize = () => {
  // Prepare main Info.plist
  let info = projectDir.read('resources/osx/Info.plist')
  info = utils.replace(info, {
    productName: manifest.productName,
    identifier: manifest.identifier,
    version: manifest.version,
    build: manifest.build,
    copyright: manifest.copyright,
  })
  finalAppDir.write('Contents/Info.plist', info)

  // Prepare Info.plist of Helper apps
  ;[' EH', ' NP', ''].forEach(helperSuffix => {
    info = projectDir.read(
      `resources/osx/helper_apps/Info${helperSuffix}.plist`,
    )
    info = utils.replace(info, {
      productName: manifest.productName,
      identifier: manifest.identifier,
    })
    finalAppDir.write(
      `Contents/Frameworks/Electron Helper${helperSuffix}.app/Contents/Info.plist`,
      info,
    )
  })

  // Copy icon
  projectDir.copy(
    'resources/osx/icon.icns',
    finalAppDir.path('Contents/Resources/icon.icns'),
  )

  return Q()
}

const renameApp = () => {
  // Rename helpers
  ;[' Helper EH', ' Helper NP', ' Helper'].forEach(helperSuffix => {
    finalAppDir.rename(
      `Contents/Frameworks/Electron${helperSuffix}.app/Contents/MacOS/Electron${helperSuffix}`,
      manifest.productName + helperSuffix,
    )
    finalAppDir.rename(
      `Contents/Frameworks/Electron${helperSuffix}.app`,
      `${manifest.productName + helperSuffix}.app`,
    )
  })
  // Rename application
  finalAppDir.rename('Contents/MacOS/Electron', manifest.productName)
  const appPath = releasesDir.path(
    finalAppDir
      .path()
      .split('/')
      .pop(),
  )
  releasesDir.remove(appPath)
  releasesDir.copy(finalAppDir.path(), appPath)
  return Q()
}

const signApp = () => {
  const teamId = utils.getSigningId()

  if (!teamId) return Q()

  let identityPrefix
  let profile

  if (utils.isMas()) {
    identityPrefix = '3rd Party Mac Developer Application'
    profile = projectDir.path('mac_appstore_distribution.provisionprofile')
  } else {
    identityPrefix = 'Developer ID Application'
    profile = projectDir.path('mac_developerID.provisionprofile')
  }

  const identity = `${identityPrefix}: UberGrape GmbH (${teamId})`
  const deferred = Q.defer()

  sign(
    {
      app: releasesDir.path(
        finalAppDir
          .path()
          .split('/')
          .pop(),
      ),
      entitlements: projectDir.path('resources/osx/parent.plist'),
      'entitlements-inherit': projectDir.path('resources/osx/child.plist'),
      identity,
      version: electronVersion,
      platform: utils.isMas() ? 'mas' : 'darwin',
      'provisioning-profile': profile,
    },
    err => {
      if (err) return deferred.reject(err)
      deferred.resolve()
      return false
    },
  )

  return deferred.promise
}

const packToPkgFile = () => {
  const identity = utils.getSigningId()
  if (identity) {
    const pack = projectDir.path('resources/osx/pack.sh')
    const cmd = `${pack} ${releasesDir.path()} ${identity}`
    gulpUtil.log('Packing with:', cmd)
    return Q.nfcall(childProcess.exec, cmd)
  }
  return Q()
}

const packToDmgFile = () => {
  const deferred = Q.defer()
  // Require appdmg here, because on Win machines this packages not installing
  const appdmg = require('appdmg') // eslint-disable-line global-require
  const dmgName = `${manifest.name}-${manifest.version}.dmg`

  // Prepare appdmg config
  let dmgManifest = projectDir.read('resources/osx/appdmg.json')
  dmgManifest = utils.replace(dmgManifest, {
    productName: manifest.productName,
    appPath: finalAppDir.path(),
    dmgIcon: projectDir.path('resources/osx/dmg-icon.icns'),
    dmgBackground: projectDir.path('resources/osx/dmg-background.png'),
  })
  tmpDir.write('appdmg.json', dmgManifest)

  // Delete DMG file with this name if already exists
  releasesDir.remove(dmgName)

  gulpUtil.log('Packaging to DMG file...')

  const readyDmgPath = releasesDir.path(dmgName)
  appdmg({
    source: tmpDir.path('appdmg.json'),
    target: readyDmgPath,
  })
    .on('error', err => {
      console.error(err) // eslint-disable-line no-console
    })
    .on('finish', () => {
      gulpUtil.log('DMG file ready!', readyDmgPath)
      deferred.resolve()
    })

  return deferred.promise
}

const cleanClutter = () => tmpDir.removeAsync('.')

module.exports = () =>
  init()
    .then(downloadRuntime)
    .then(copyRuntime)
    .then(cleanupRuntime)
    .then(packageBuiltApp)
    .then(finalize)
    .then(renameApp)
    .then(signApp)
    .then(packToPkgFile)
    .then(packToDmgFile)
    .then(cleanClutter)
    .catch(console.error) // eslint-disable-line no-console
