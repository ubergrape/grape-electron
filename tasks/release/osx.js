'use strict';

var Q = require('q');
var gulpUtil = require('gulp-util');
var jetpack = require('fs-jetpack');
var asar = require('asar');
var utils = require('../utils');
var child_process = require('child_process');
var sign = require('electron-osx-sign');
var download = require('electron-download');
var extract = require('extract-zip');
var fs = require('fs');
var semver = require('semver');
var path = require('path');

var projectDir;
var releasesDir;
var tmpDir;
var distDir;
var finalAppDir;
var manifest;
var electronVersion;

var init = function () {
    projectDir = jetpack;
    tmpDir = projectDir.dir('./tmp', { empty: true });
    distDir = tmpDir.dir('./dist', { empty: true });
    releasesDir = projectDir.dir('./releases');
    manifest = projectDir.read('app/package.json', 'json');
    electronVersion = projectDir.read('package.json', 'json').devDependencies.electron;
    electronVersion = semver.clean(electronVersion.replace(/\^/g, ''))
    finalAppDir = tmpDir.cwd(manifest.productName + '.app');

    return Q();
};

var downloadRuntime = function() {
    var deferred = Q.defer();

    // If it is not for mas, it has been already downloaded during installation.
    if (!utils.isMas()) {
        deferred.resolve();
        return deferred.promise;
    }

    var platformPath = 'dist/Electron.app/Contents/MacOS/Electron';

    gulpUtil.log('Downloading MAS build version', electronVersion, 'to', distDir.path());

    download({
      version: electronVersion,
      platform: 'mas',
      arch: process.env.npm_config_arch,
      strictSSL: process.env.npm_config_strict_ssl === 'true',
      quiet: ['info', 'verbose', 'silly', 'http'].indexOf(process.env.npm_config_loglevel) === -1
    }, extractFile);

    // unzips and makes path.txt point at the correct executable
    function extractFile (err, zipPath) {
      if (err) return deferred.reject(err);
      gulpUtil.log('Extracting from', zipPath);
      var options = {
        dir: distDir.path()
      };
      extract(zipPath, options, function (err) {
        if (err) return deferred.reject(err);
        deferred.resolve();
      });
    }

    return deferred.promise;
};

var copyRuntime = function () {
    var dist = 'node_modules/electron/dist';
    if (utils.isMas()) dist = distDir.path();
    var source = path.join(dist, 'Electron.app');
    var dest = finalAppDir.path();
    gulpUtil.log('Copy build from', source, 'to', dest);
    return projectDir.copyAsync(source, dest);
};

var cleanupRuntime = function () {
    finalAppDir.remove('Contents/Resources/default_app');
    finalAppDir.remove('Contents/Resources/atom.icns');
    return Q();
};

var packageBuiltApp = function () {
    var deferred = Q.defer();

    asar.createPackage(projectDir.path('build'), finalAppDir.path('Contents/Resources/app.asar'), function () {
        deferred.resolve();
    });

    return deferred.promise;
};

var finalize = function () {
    // Prepare main Info.plist
    var info = projectDir.read('resources/osx/Info.plist');
    info = utils.replace(info, {
        productName: manifest.productName,
        identifier: manifest.identifier,
        version: manifest.version,
        build: manifest.build,
        copyright: manifest.copyright
    });
    finalAppDir.write('Contents/Info.plist', info);

    // Prepare Info.plist of Helper apps
    [' EH', ' NP', ''].forEach(function (helper_suffix) {
        info = projectDir.read('resources/osx/helper_apps/Info' + helper_suffix + '.plist');
        info = utils.replace(info, {
            productName: manifest.productName,
            identifier: manifest.identifier
        });
        finalAppDir.write('Contents/Frameworks/Electron Helper' + helper_suffix + '.app/Contents/Info.plist', info);
    });

    // Copy icon
    projectDir.copy('resources/osx/icon.icns', finalAppDir.path('Contents/Resources/icon.icns'));

    return Q();
};

var renameApp = function () {
    // Rename helpers
    [' Helper EH', ' Helper NP', ' Helper'].forEach(function (helper_suffix) {
        finalAppDir.rename('Contents/Frameworks/Electron' + helper_suffix + '.app/Contents/MacOS/Electron' + helper_suffix, manifest.productName + helper_suffix );
        finalAppDir.rename('Contents/Frameworks/Electron' + helper_suffix + '.app', manifest.productName + helper_suffix + '.app');
    });
    // Rename application
    finalAppDir.rename('Contents/MacOS/Electron', manifest.productName);
    var appPath = releasesDir.path(finalAppDir.path().split('/').pop())
    releasesDir.remove(appPath)
    releasesDir.copy(finalAppDir.path(), appPath)
    return Q();
};

var signApp = function () {
    var identity = utils.getSigningId();
    var deferred = Q.defer();
    if (identity) {
      sign(
        {
          app: releasesDir.path(finalAppDir.path().split('/').pop()),
          entitlements: projectDir.path('resources/osx/parent.plist'),
          'entitlements-inherit': projectDir.path('resources/osx/child.plist'),
          identity: identity,
          version: electronVersion,
          platform: 'mas',
          'provisioning-profile': projectDir.path('Electron_Chat_Prod.provisionprofile')
        },
        function(err) {
          if (err) return deferred.reject(err)
          deferred.resolve()
        }
      )
      return deferred.promise
    } else {
        return Q();
    }
};

var packToPkgFile = function() {
  var identity = utils.getSigningId();
  if (identity) {
    var pack = projectDir.path('resources/osx/pack.sh')
    var cmd = pack + ' ' + releasesDir.path() + ' ' + identity;
    gulpUtil.log('Packing with:', cmd);
    return Q.nfcall(child_process.exec, cmd);
    return Q();
  } else {
    return Q();
  }
}

var packToDmgFile = function () {
    var deferred = Q.defer();
    var appdmg = require('appdmg');
    var dmgName = manifest.name + '-' + manifest.version + '.dmg';

    // Prepare appdmg config
    var dmgManifest = projectDir.read('resources/osx/appdmg.json');
    dmgManifest = utils.replace(dmgManifest, {
        productName: manifest.productName,
        appPath: finalAppDir.path(),
        dmgIcon: projectDir.path("resources/osx/dmg-icon.icns"),
        dmgBackground: projectDir.path("resources/osx/dmg-background.png")
    });
    tmpDir.write('appdmg.json', dmgManifest);

    // Delete DMG file with this name if already exists
    releasesDir.remove(dmgName);

    gulpUtil.log('Packaging to DMG file...');

    var readyDmgPath = releasesDir.path(dmgName);
    appdmg({
        source: tmpDir.path('appdmg.json'),
        target: readyDmgPath
    })
    .on('error', function (err) {
        console.error(err);
    })
    .on('finish', function () {
        gulpUtil.log('DMG file ready!', readyDmgPath);
        deferred.resolve();
    });

    return deferred.promise;
};

var cleanClutter = function () {
    return tmpDir.removeAsync('.');
};

module.exports = function () {
    return init()
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
        .catch(console.error);
};
