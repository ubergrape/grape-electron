const pathUtil = require('path')
const Q = require('q')
const gulp = require('gulp')
const jetpack = require('fs-jetpack')

const utils = require('../utils')

const projectDir = jetpack
const srcDir = projectDir.cwd('./app')
const destDir = projectDir.cwd('./build')
const gulpPath = pathUtil.resolve('./node_modules/.bin/gulp')

const copyFromAppDirs = ['./node_modules/**', './lib/**']

gulp.task('clean', callback => destDir.dirAsync('.', { empty: true }))

gulp.task('copy', ['clean'], () =>
  projectDir.copyAsync('app', destDir.path(), {
    overwrite: true,
    matching: copyFromAppDirs,
  }),
)

gulp.task('finalize', ['clean'], () => {
  const manifest = srcDir.read('package.json', 'json')

  // Add "dev" or "test" suffix to name, so Electron will write all data
  // like cookies and localStorage in separate places for each environment.
  switch (utils.getEnvName()) {
    case 'development':
      manifest.name += '-dev'
      manifest.productName += ' Dev'
      break
    case 'test':
      manifest.name += '-test'
      manifest.productName += ' Test'
      break
  }

  // Copy environment variables to package.json file for easy use
  // in the running application. This is not official way of doing
  // things, but also isn't prohibited ;)
  manifest.env = projectDir.read(
    `config/env_${utils.getEnvName()}.json`,
    'json',
  )

  destDir.write('package.json', manifest)
})

gulp.task('build', ['copy', 'finalize'])
