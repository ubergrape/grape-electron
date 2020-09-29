## Quickstart

```bash
# Install dependencies
yarn
# Run the app
yarn start
```

## Scripts

`clean` - removes `lib` and `release` folders.

`build` - build project code and app once.

`build:lib` - build project code once.

`build:lib:watch` - build project code after each code update.

`start` - run an app once for debug.

`start:proxy` - run app once with proxy port for `grape-web-client`

`start:watch` - run the app with hot-reload after each code update.

`start:watch:proxy` - run app with hot-reload after each code update and proxy port for `grape-web-client`.

`release` - build and upload the app build to GitHub releases. Before the run, set up with `Releasing` chapter.

`release:win` - build and upload the app build for Windows to GitHub releases. Use `GH_TOKEN` as an environment variable to set up a GitHub token for automatic upload.

`release:ci` - build and upload the app build for Linux to GitHub releases from GitLab CI.

`i18n:export` - export language files from `src/i18n` to `i18n`.

`i18n:import` - import language files to `src/i18n` from `i18n`.

## Releasing

```bash
# Pull latest changes
git pull
# Reinstall dependencies
rm -rf node_modules && yarn
```

To build the app, you need to use a local environment for macOS and Windows and GitLab CI for Linux.
General processes will be described below. And OS-specific below them, with OS type title name.

### Creating a release draft

If version already drafted, please skip these steps.
You can check releases [here](https://github.com/ubergrape/grape-electron/releases).

1. Create version commit. Change `version` field in `package.json` for the version you want to release, e.g. `1.0.0` and increment `buildVersion`, e.g you should change `99` to `100`.
2. Push this commit with same commit message as `version` in `package.json`.
3. Set a new GitHub release draft. A tag should be same as version field in `package.json` but with `v` prefix. For example for version `1.0.0` tag name is `v1.0.0`. Release name and descriptions can be anything you want.

More info [here](https://www.electron.build/configuration/publish.html#recommended-github-releases-workflow).

### Setup token

If you already have `.token` file in the root of the project, please skip these steps.

1. Go to [token page](https://github.com/settings/tokens) and create one.
2. Copy token to the clipboard.
3. Create `.token` file in the root of the project.
4. Paste token and save the file.

For Windows build, with `release:win` please use `GH_TOKEN` environment variable to provide GitHub token.

### Provide credentials from Apple ID

If you already have `.apple-user` and `.apple-password` files in the root of the project, please skip these steps.

1. Create `.apple-user` and `.apple-password` files
2. Paste user and password to those files. If you're using 2FA, create App-Specific Password. More details [here](https://support.apple.com/en-us/HT204397).

### macOS

Run the command below, to build and upload a new app to draft release. Please make sure that all needed certificates installed. Check [documentation](https://www.electron.build/code-signing.html#how-to-export-certificate-on-macos) to know how to export certificate. Ask Apple Developer Account owner for your developer account and help with providing certificates.

```bash
GH_TOKEN=<token> yarn release
```

After, you'll see `mas`, `dmg` and `zip` files in the draft release.

#### MacOS store build

For macOS store build please set `hardenedRuntime` to `false` in config. To speed up the build process for the app store version, you can leave only `mas` target in macOS `targets` field.

### Linux

If you're doing release first time, you need to ask somebody to grant permissions for GitLab repo. And then save your token to `GITHUB_PUBLISH_TOKEN` variable in "Variables" section in GitLab repository. Path is "Settings" -> "CI/CD" -> "Variables"

1. Push your latest changes with release commit to GitLab.
2. Go to "CI/CD" -> "Pipelines", and click "Run pipeline".
3. Choose the correct branch and click "Run pipeline" again.
4. It will initiate a build and uploading process. After the process will be finished, you'll see `tar.gz`, `deb`, `rpm` and `AppImage` builds in the draft release.

### Windows

Please download and install pre-configured Windows 10 virtual image for VirtualBox. You can find by this [link](https://github.com/ubergrape/chatgrape/wiki/Windows-virtual-image) (only accessible to Grape developers) or in external drive at the office.

Run the command below, to build and upload a new app to draft release.

1. Put USB-token to a USB drive.
2. `GH_TOKEN=<token> yarn release:win`
3. Go to Passbolt account and copy a password from "Sectigo USB security token" resource, if it's not available for you, ask for access from a responsible person.
4. Paste every time, when "Token Logon" window will be prompted.

After you'll see `exe`, `msi` and `appx` builds in the draft release.

#### Windows store build

To build the Windows store version you need to remove all of the fields related to the signature process because Windows store requires an unsigned app. So, to build it please remove `certificateSubjectName` and `rfc3161TimeStampServer` fields. Also to speed build-up, you can leave only `appx` in Windows `targets` field.
