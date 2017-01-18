# Electron Build Instructions

## Common

```bash
git clone git@github.com:ubergrape/grape-electron.git
cd grape-electron
npm install
npm run release
```
The result will be an executable (`dmg`, `app`, `exe`) and installer (`msi`, `pkg`) file in `./releases` with version suffix from from `./app/package.json`.

* Unsigned releaase is for development only. *

## App signing

### MacOS

You need to sign a release to:

- upload it to MacOS AppStore
- create a signed release for a distribution without store
- create and install all certificates from developer.apple.com

  ![](./images/mac-certificates-screen.png)

  http://stackoverflow.com/questions/29039462/which-certificate-should-i-use-to-sign-my-mac-os-x-application
- Download provision profiles and put them into the root:
  - Electron_Chat_Dev.provisionprofile
  - Electron_Chat_Prod.provisionprofile
- Increment [build number](https://github.com/ubergrape/grape-electron/blob/master/app/package.json#L7) for each review upload (you can upload same version multiple times if the review failed, but the build number should be unique all the time, don't reset this number ever, even for new version)

- Signed store release `npm run release -- --sign {teamId} --mas`
- Signed distribution outside of store `npm run release -- --sign {teamId}`

  To sign the app you first need to get a certificate from Apple as described here: https://github.com/electron/electron/blob/master/docs/tutorial/mac-app-store-submission-guide.md#get-certificate

- Use "Application Loader" app to upload the package to the store.
- Go to https://itunesconnect.apple.com and publish it.

### Windows

In order to sign you need a certificate and a password.
So you need to have certificate on your `win7` and password.
In order to sign you need a certificate and a password.
We have a pre configured windows 7 image that you can find at [Parallels Windows7 Image](https://github.com/ubergrape/chatgrape/wiki/Electron-Build-Instructions#windows-1). The certificate will be in `c:\grape_code_signing.p12`.

Or if you're building own environment, you need to get it with password from @sk7

```
npm run release -- --sign PASSWORD --cert c:\path-to-cert.p12
```

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
