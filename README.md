# MX Mobile Widget SDK for React Native

## Using the Widget SDK on your application

To get starting using the Widget SDK in your React Native application, you will
first need to sign up for the MX API and get your client id and API key from
the dashboard. Once you have that information, open a terminal and run the
commands below at the root of your project to install and setup the SDK:

```
npm install --save @mxenabled/mobile-widget-sdk
```

Setup the SDK and link its dependencies:

```
npx mx-mobile-widget-sdk-setup
```

Once the steps above have been completed, you will be able to import widget
components from the `@mxenabled/mobile-widget-sdk` package and render them in
your application:

```jsx
import React from "react"

import { ConnectWidget } from "@mxenabled/mobile-widget-sdk"

export default function App() {
  return (
    <ConnectWidget proxy="https://myserver.com/generate-sso-url?userId=123" />
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
your application, you will need to do three things:

- Update your application and enable deeplinking from native code into the
  React Native layer. See https://reactnative.dev/docs/linking for instructions
  on how to do that.
- Ensure you application has a scheme. You can install and use
  https://www.npmjs.com/package/uri-scheme to manage your application's
  schemes.
- Provde your application's scheme to the widget component with the
  `uiMessageWebviewUrlScheme` prop.

```jsx
<ConnectWidget uiMessageWebviewUrlScheme="sampleScheme" />
```


### Development

This package is written in TypeScript, so if you're developing your application
in TypeScript you will be able to leverage all of the type definitions that are
shipped with the package.
