const Q = require('q')
const electron = require('electron')
const pathUtil = require('path')
const childProcess = require('child_process')
const utils = require('./utils')
const jetpack = require('fs-jetpack')
const gulp = require('gulp')
const gutil = require('gulp-util')

const gulpPath = pathUtil.resolve('./node_modules/.bin/gulp')
const srcDir = jetpack.cwd('./app')
const destDir = jetpack.cwd('./build')
const watchDir = './lib/**'

function runBuildApp() {
  const deferred = Q.defer()

  const build = childProcess.spawn(
    utils.spawnablePath(gulpPath),
    ['build', `--env=${utils.getEnvName()}`, '--color'],
    {
      stdio: 'inherit',
    },
  )

  build.on('close', code => {
    deferred.resolve(code)
  })

  return deferred.promise
}

function runBuildSrc() {
  const deferred = Q.defer()

  const build = childProcess.spawn('yarn build:watch', {
    stdio: 'inherit',
    cwd: srcDir.path(),
    shell: true,
  })

  build.on('close', code => {
    deferred.resolve(code)
  })

  return deferred.promise
}

function watch(onChange) {
  function copyFile(path) {
    gutil.log(`Copy file ${path.substr(srcDir.path().length)}`)
    const destPath = path.replace(srcDir.path(), destDir.path())
    jetpack.copy(path, destPath, { overwrite: true })
  }

  gulp
    .watch(watchDir, {
      cwd: 'app',
      debounceDelay: 2000,
    })
    .on('change', change => {
      if (change.type !== 'changed') return
      copyFile(change.path)
      onChange()
    })
}

const runApp = function() {
  const app = childProcess.spawn(electron, ['./build'], {
    stdio: 'inherit',
  })

  app.once('close', code => {
    if (code !== null) {
      gutil.log('App died.')
      process.exit()
    }
  })

  return app
}

function start() {
  let app = runApp()

  watch(() => {
    app.kill('SIGUSR1')
    app = runApp()
  })
}

runBuildApp()
  .then(runBuildSrc())
  .then(start)
  .catch(err => {
    console.log(err)
  })
