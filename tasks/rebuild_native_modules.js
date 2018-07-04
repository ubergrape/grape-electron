// Rebuilds native node modules for Electron.
// More: https://github.com/atom/electron/blob/master/docs/tutorial/using-native-node-modules.md

const path = require('path')
const Q = require('q')
const electron = require('electron')
const electronPackage = require('electron/package.json')
const rebuild = require('electron-rebuild')

const pathToElectronNativeModules = path.join(__dirname, '../app/node_modules')

rebuild
  .shouldRebuildNativeModules(electron)
  .then(shouldBuild => {
    if (!shouldBuild) {
      return true
    }

    console.log('Rebuilding native modules for Electron...')

    return rebuild
      .installNodeHeaders(electronPackage.version)
      .then(() =>
        rebuild.rebuildNativeModules(
          electronPackage.version,
          pathToElectronNativeModules,
        ),
      )
  })
  .then(() => {
    console.log('Rebuilding complete.')
  })
  .catch(err => {
    console.error('Rebuilding error!')
    console.error(err)
  })
