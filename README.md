## To Use

```bash
# Install dependencies
yarn
# Run the app
yarn start
```

## Releasing

```bash
# Pull latest changes
git pull
# Reinstall dependencies
rm -rf node_modules && yarn
```

### Creating release draft

If version already drafted, please skip "Creating release draft" steps.
You can check releases [here](https://github.com/ubergrape/grape-electron/releases).

1. Create version commit. Change `version` field in `package.json` for version you want to release, e.g. `1.0.0` and increment `buildVersion` by 1, e.g you should change `99` to `100`.
2. Push this commit.
3. Set new GitHub release draft. Tag should be same as version field in `package.json` but with `v` prefix. For example for version `1.0.0` tag name is `v1.0.0`. Release name and descriptions can be anything you want.

More info [here](https://www.electron.build/configuration/publish.html#recommended-github-releases-workflow)

If you already have `.token` file in root of project, please skip "Setup token" steps

### Setup token

1. Got to [token page](https://github.com/settings/tokens) and create one.
2. Copy token to clipboard
3. Create `.token` file in root of project.
4. Paste token and save file.

### Build and deploy release

```bash
yarn deploy
```

## Scripts

```

```
