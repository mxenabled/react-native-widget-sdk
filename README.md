# MX Mobile Widget SDK for React Native

## Using the Widget SDK on your app

To get starting using the Widget SDK in your React Native app, you will first
need to sign up for the MX API and get your client id and API key from the
dashboard. Once you have that information, open a terminal and run the commands
below at the root of your project:

```
npm install @mxenabled/mobile-widget-sdk
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
    <ConnectWidget
      clientId="<client id>"
      apiKey="<api key>"
      userGuid="<user guid>"
      environment="<mx environment: production, integration, qa, sand>"
    />
  )
}
```

This package is written in TypeScript, so if you're developing your app in
TypeScript you will be able to leverage all of the type definitions that are
shipped with the package.


## Development setup

The only dependency to _develop_ this application is Node v16. Once Node is
installed, you can install all other dependencies with npm. Below are commands
you will find useful while developing this app:

```bash
npm install             # Install depedencies
npm run build           # Run TypeScript compiler
npm run build:dist      # Compile and save output to dist directory
npm run test            # Run unit tests
npm run test:coverage   # Run unit tests and generate code coverage report
npm run open:coverage   # Open code coverage report
npm run generate        # Run code generators
```

## Running the example app

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

```bash
npm install             # Installs dependencies
npm run ios             # Installs and runs app in iOS emulator
npm run android         # Installs and runs app in Android emulator
```
