# MX Mobile Widget SDK for React Native

## Using the Widget SDK on your app

To get starting using the Widget SDK in your React Native app, you will first
need to sign up for the MX API and get your client id and API key from the
dashboard. Once you have that information, open a terminal and run the commands
below at the root of your project:

```
npm install --save @mxenabled/mobile-widget-sdk
npx mx-mobile-widget-sdk-setup
```

Once you have installed the package and ran the setup script, you will be able
to import widget components from the `@mxenabled/mobile-widget-sdk` package and
render them in your app:

```jsx
import React from "react"

import { ConnectWidget } from "@mxenabled/mobile-widget-sdk"

export default function App() {
  return (
    <ConnectWidget proxy="https://myserver.com/generate-sso-url" />
  )
}
```

### Getting an SSO URL

_TODO_


### Components

_TODO_


### Component options

_TODO_


### OAuth redirects and deeplinks

In order to properly handle OAuth redirects from the Connect widget back to
your app, you will need to do three things:

- Update your application and enable deeplinking from native code into the
  React Native layer. See https://reactnative.dev/docs/linking for instructions
  on how to do that.
- Ensure you app has a scheme. You can install and use
  https://www.npmjs.com/package/uri-scheme to manage your app's schemes.
- Provde your app's scheme to the widget component with the
  `uiMessageWebviewUrlScheme` prop.

```jsx
<ConnectWidget uiMessageWebviewUrlScheme="sampleScheme" />
```


### Development

This package is written in TypeScript, so if you're developing your app in
TypeScript you will be able to leverage all of the type definitions that are
shipped with the package.


### Running the example app

First, you will need to set up your environment so that you can run React
Native apps. See https://reactnative.dev/docs/environment-setup for
instructions on how to do that. In addition, you'll need to download and
install Android Studio, Xcode, and Node v16.

Once your environment is setup, cd into the `example` directory and create a
`config.json` file that looks like the one below, but with the appropriate
values (all of which you can get from Batcave):

```json
{
  "MX_CLIENT_ID": "...",
  "MX_API_KEY": "...",
  "MX_USER_GUID": "...",
  "MX_ENVIRONMENT": "integration"
}
```

Next, install dependencies and run the app in an iOS or Android emulator. Here
are all of the commands you need to do that:

```
npm install             # Installs dependencies
npm run ios             # Installs and runs app in iOS emulator
npm run android         # Installs and runs app in Android emulator
```


## Development setup

Besides a React Native app, the only dependency to develop this application is
Node v16. Once Node is installed, you can install all other dependencies with
npm. Below are commands you will find useful while developing this app:

```
npm install             # Install depedencies
npm run build           # Run TypeScript compiler
npm run build:dist      # Compile and save output to dist directory
npm run test            # Run unit tests
npm run test:coverage   # Run unit tests and generate code coverage report
npm run open:coverage   # Open code coverage report
npm run generate        # Run code generators
```
