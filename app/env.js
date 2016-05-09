// Simple module exposes environment variables to rest of the code.

import jetpack from 'fs-jetpack';
import {isWindows} from './utils'

var app;
if (process.type === 'renderer') {
    app = require('electron').remote.app;
} else {
    app = require('electron').app;
}
var appDir = jetpack.cwd(app.getAppPath());

var manifest = appDir.read('package.json', 'json');

if (manifest.env.name === 'development') {
  manifest.env.host = isWindows() ? manifest.env.host.win : manifest.env.host.default
}

export default manifest.env;
