# Electron Build Instructions

## Common

```bash
git clone git@github.com:ubergrape/grape-electron.git
cd grape-electron
npm install
npm run release
```
The result would be a installable (`dmg` and `app` or `msi` and `exe`) file in `./releases/` with version prefix that match version from `./app/package.json`

## App signing

### MacOS

You need to sign release:

- to upload it to MacOS AppStore
- to create a signed release for a distribution without store
- create and install all certificates from developer.apple.com

  ![](./images/mac-certificates-screen.png)

  http://stackoverflow.com/questions/29039462/which-certificate-should-i-use-to-sign-my-mac-os-x-application

- Increment [build number](https://github.com/ubergrape/grape-electron/blob/master/app/package.json#L7) for each review upload (you can upload same version multiple times if review failed, but build should be uniq all the time, don't reset this number ever, even for new version)

- Signed store release `npm run release -- --sign {teamId} --mas`
- Signed distribution outside of store `npm run release -- --sign {teamId}`

For signing you will need group of certificates in `Keychain Access`, described here: https://github.com/electron/electron/blob/master/docs/tutorial/mac-app-store-submission-guide.md#get-certificate

### Windows
You need to sign any release on Windows.
So you need to have certificate on your `win7` and password.
It is already there on our pre-setup [Parallels Windows7 Image](https://github.com/ubergrape/chatgrape/wiki/Electron-Build-Instructions#windows-1) at `c:\grape_code_signing.p12`
Or if you're building own environment, you need to get it with password from @sk7

```
npm run release -- --sign PASSWORD --cert c:\path-to-cert.p12
```

## macOS

## Windows

_We're building only 32bit application._
_To build 64bit app you need to use 64bit Windows._

-----

Otherwise you need to:
 * install 32bit node (last safe version is `6.3.0`)
 * install git or download source
 * install latest [WiX] (http://wixtoolset.org/)
   * add path to `bin` folder (usually it will be `C:\Program Files\WiX Toolset v3.9\bin\`) to `Path` variable. [See instructions](http://www.nextofwindows.com/how-to-addedit-environment-variables-in-windows-7)
 * install [microsoft windows sdk for win7] (https://www.microsoft.com/en-us/download/details.aspx?id=8279)
   * add path to `bin` folder (usually it will be `C:\Program Files\Microsoft SDKs\Windows\v7.1\Bin`) to `Path` variable. [See instructions](http://www.nextofwindows.com/how-to-addedit-environment-variables-in-windows-7)
 * fix the [msvcp120.dll issue](https://www.google.com.ua/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=msvcp120+dll+windows)

-----

When your env is ready or VM is up, use **Common** instructions above.
