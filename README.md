# MX Mobile Widget SDK for React Native

## Using the Widget SDK on your app

To get starting using the Widget SDK in your React Native app, you will first
need to sign up for the MX API and get your client id and API key from the
dashboard. Once you have that information, open a terminal and run the commands
below at the root of your project:

```
npm install mx-mobile-widget
npx mx-mobile-widget-sdk-setup
```

Once you have installed the package and ran the setup script, you will be able
to import widget components from the `mx-mobile-widget` package and render them
in your app:

```jsx
import React from "react"

import { ConnectWidget } from "mx-mobile-widget"

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

The `mx-mobile-widget` package is written in TypeScript, so if you're
developing your app in TypeScript you will be able to leverage all of the type
definitions that are shipped with the package.


## Development setup

First, you will need to set up your environment so that you can run React
Native apps. See https://reactnative.dev/docs/environment-setup for
instructions on how to do that. In addition, you'll need to download and
install Android Studio, Xcode, and Node v17.

Once your environment is setup, create a config.json file that looks like the
one below, but with the appropriate values (all of which you can get from
Batcave):

```json
{
  "MX_CLIENT_ID": "...",
  "MX_API_KEY": "...",
  "MX_USER_GUID": "...",
  "MX_ENVIRONMENT": "integration"
}
```

Next, install dependencies, link native libraries, and then install and run the
app in an iOS or Android emulator. Here are all of the commands you need to do
that:

```bash
npm install             # Installs dependencies
npm link                # Links native libraries in iOS and Android apps
npm run ios             # Installs and runs app in iOS emulator
npm run android         # Installs and runs app in Android emulator
```

Other useful commands for developers:

```bash
npm run build           # Run TypeScript compiler
npm run build:dist      # Compile and save output to dist directory
npm run test            # Run unit tests
npm run test:coverage   # Run unit tests and generate code coverage report
npm run open:coverage   # Open code coverage report
npm run generate        # Run code generators
```


---

[![Pipeline Badge](https://gitlab.mx.com/mx/mobile-widget-sdk-react-native/badges/master/pipeline.svg)](https://gitlab.mx.com/mx/mobile-widget-sdk-react-native/-/pipelines)
