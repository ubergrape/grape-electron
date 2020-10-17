#!/bin/bash

CURRENT_PATH="$( cd "$(dirname "$0")" ; pwd -P )"

# Name of your app.
APP="Grape"
COMPANY_DEVELOPER_ID="UberGrape GmbH (Y8DPE6DGC7)"
# The path of your app to sign.
APP_PATH="$CURRENT_PATH/dist/mac/$APP.app"
# The path to the location you want to put the signed package.
RESULT_PATH="$CURRENT_PATH/dist/mac/$APP-Publish-Ready.pkg"

# The name of certificates you requested.
APP_KEY="Developer ID Application: $COMPANY_DEVELOPER_ID"
#APP_KEY="3rd Party Mac Developer Application: $COMPANY_DEVELOPER_ID"
INSTALLER_KEY="3rd Party Mac Developer Installer: $COMPANY_DEVELOPER_ID"
# The path of your plist files.
CHILD_PLIST="$CURRENT_PATH/build/entitlements.mas.inherit.plist"
PARENT_PLIST="$CURRENT_PATH/build/entitlements.mas.plist"
LOGINHELPER_PLIST="$CURRENT_PATH/build/entitlements.mas.loginhelper.plist"

FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"

codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libEGL.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libEGL.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libGLESv2.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libGLESv2.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Electron Framework"

# codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/$APP Helper"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/Contents/MacOS/$APP Login Helper"
codesign -s "$APP_KEY" -f --entitlements "$LOGINHELPER_PLIST" "$APP_PATH/Contents/Library/LoginItems/$APP Login Helper.app/"


codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper (GPU).app/Contents/MacOS/$APP Helper (GPU)"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper (GPU).app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper (Renderer).app/Contents/MacOS/$APP Helper (Renderer)"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper (Renderer).app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper (Plugin).app/Contents/MacOS/$APP Helper (Plugin)"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper (Plugin).app/"

codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/Payload/Applications/Grape.app/Contents/MacOS/$APP"


codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/MacOS/$APP"
codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$APP_PATH"

#productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
#codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$RESULT_PATH"
