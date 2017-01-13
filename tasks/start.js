'use strict';

var Q = require('q');
var electron = require('electron');
var pathUtil = require('path');
var childProcess = require('child_process');
var utils = require('./utils');
var jetpack = require('fs-jetpack');
var gulp = require('gulp');
var gutil = require('gulp-util');

var gulpPath = pathUtil.resolve('./node_modules/.bin/gulp');
var srcDir = jetpack.cwd('./app');
var destDir = jetpack.cwd('./build');
var watchDir = './lib/**'

function runBuildApp() {
    var deferred = Q.defer();

    var build = childProcess.spawn(utils.spawnablePath(gulpPath), [
        'build',
        '--env=' + utils.getEnvName(),
        '--color'
    ], {
        stdio: 'inherit'
    });

    build.on('close', function (code) {
        deferred.resolve(code);
    });

    return deferred.promise;
};

function runBuildSrc() {
    var deferred = Q.defer();

    var build = childProcess.spawn('npm run build:watch', {
        stdio: 'inherit',
        cwd: srcDir.path(),
        shell: true
    });

    build.on('close', function (code) {
        deferred.resolve(code);
    });

    return deferred.promise;
};

function watch(onChange) {
    function copyFile(path) {
        gutil.log(`Copy file ${path.substr(srcDir.path().length)}`);
        const destPath = path.replace(srcDir.path(), destDir.path());
        jetpack.copy(path, destPath, {overwrite: true});
    }

    gulp.watch(watchDir, {
        cwd: 'app',
        debounceDelay: 2000
    })
    .on('change', function(change) {
        if (change.type !== 'changed') return;
        copyFile(change.path);
        onChange();
    });
};

var runApp = function () {
    var app = childProcess.spawn(electron, ['./build'], {
        stdio: 'inherit'
    });

    app.once('close', (code) => {
        if (code !== null) {
            gutil.log('App died.');
            process.exit();
        }
    });

    return app;
};

function start() {
    var app = runApp();

    watch(() => {
        app.kill('SIGUSR1');
        app = runApp();
    });
}

runBuildApp()
    .then(runBuildSrc())
    .then(start)
    .catch((err) => {
        console.log(err);
    });
