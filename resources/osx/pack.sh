#!/bin/bash

# Name of your app.
APP="Grape"
# The path of you app to sign.
APP_PATH="$1/$APP.app"
# The path to the location you want to put the signed package.
RESULT_PATH="$1/$APP.pkg"
# The name of certificates you requested.
INSTALLER_KEY="3rd Party Mac Developer Installer: UberGrape GmbH ($2)"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
