## Quickstart

```bash
# Install dependencies
yarn
# Run the app
yarn start
```

## Scripts

`build` - build project code and app once.

`build:lib` - build project code once.

`build:lib:watch` - build project code after each code update.

`start` - run an app once for debug.

`start:proxy` - run app once with proxy port for `grape-web-client`

`start:watch` - run the app with hot-reload after each code update.

`start:watch:proxy` - run app with hot-reload after each code update and proxy port for `grape-web-client`.

`release` - build and upload the app build to GitHub releases. Before the run, set up with `Releasing` chapter.

`i18n:export` - export language files from `src/i18n` to `i18n`.

`i18n:import` - import language files to `src/i18n` from `i18n`.

`precommit` - pre-commit script, in use by `lint-staged`.

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

1. Create version commit. Change `version` field in `package.json` for the version you want to release, e.g. `1.0.0` and increment `buildVersion` by 1 (There are two `buildVersion` fields in `package.json`. Please change both), e.g you should change `99` to `100`.
2. Push this commit with same commit message as `version` in `package.json`.
3. Set a new GitHub release draft. A tag should be same as version field in `package.json` but with `v` prefix. For example for version `1.0.0` tag name is `v1.0.0`. Release name and descriptions can be anything you want.

More info [here](https://www.electron.build/configuration/publish.html#recommended-github-releases-workflow)

### Setup token

If you already have `.token` file in the root of the project, please skip these steps.

1. Got to [token page](https://github.com/settings/tokens) and create one.
2. Copy token to the clipboard.
3. Create `.token` file in the root of the project.
4. Paste token and save the file.

### MacOS

Simply run the command below, to build and deploy a new app to release draft.

```bash
yarn release
```

After, you'll see `mas`, `dmg` and `zip` files in the release draft.

### Linux

If you're doing release first time, you need to ask somebody to grant permissions for GitLab repo. And then save your token to `GITHUB_PUBLISH_TOKEN` variable in "Variables" section in GitLab repository. Path is "Settings" -> "CI/CD" -> "Variables"

1. Push your latest changes with release commit to GitLab.
2. Go to "CI/CD" -> "Pipelines", and click "Run pipeline". It will initiate a build and deploy process. After the process will be finished, you'll see `tar.gz`, `deb`, `rpm` and `AppImage` files in the release draft.
