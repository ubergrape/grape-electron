## Setup

Use Node 8

```
nvm use 8
```

Install dependencies

```
yarn
```

### Run

```
yarn start
```

This will start the Electron App and load the Grape Web App. This mean when you run the proxy (see grape-web-client) it will render your local version.

In case you make changes to Electron specific code use the common Browser refresh combination (OSX: Cmd + R) and it will not only reload the website, but the complete Electron app.
