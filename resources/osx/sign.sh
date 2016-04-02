#!/bin/bash

# Name of your app.
APP="Grape"
# The path of you app to sign.
APP_PATH="$1/$APP.app"
# The path to the location you want to put the signed package.
RESULT_PATH="$1/$APP.pkg"
# The name of certificates you requested.
APP_KEY="3rd Party Mac Developer Application: UberGrape GmbH ($2)"
INSTALLER_KEY="3rd Party Mac Developer Installer: UberGrape GmbH ($2)"

CONTENTS_PATH="$APP_PATH/Contents"
FRAMEWORKS_PATH="$CONTENTS_PATH/Frameworks"

codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/Grape Helper"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper EH.app/"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper EH.app/Contents/MacOS/Grape Helper EH"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper NP.app/"
codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/$APP Helper NP.app/Contents/MacOS/Grape Helper NP"
if [ -d "$FRAMEWORKS_PATH/Squirrel.framework/Versions/A" ]; then
  # Signing a non-MAS build.
  codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Mantle.framework/Versions/A"
  codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/ReactiveCocoa.framework/Versions/A"
  codesign --deep -fs "$APP_KEY" --entitlements child.plist "$FRAMEWORKS_PATH/Squirrel.framework/Versions/A"
fi
codesign -fs "$APP_KEY" --entitlements parent.plist "$APP_PATH"

productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
