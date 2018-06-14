const gulp = require('gulp')
const utils = require('../utils')

const releaseForOs = {
  osx: require('./osx'),
  linux: require('./linux'),
  windows: require('./windows'),
}

gulp.task('release', ['build'], () => releaseForOs[utils.os()]())
