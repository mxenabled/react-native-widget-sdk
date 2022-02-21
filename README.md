# MX React Native Widget SDK

## About this project

The purpose of this project is to enable you to quickly load and configure MX
widgets for your intended purpose. After installing this project via npm, you
will be able to import and load MX widgets in your React Native application,
and configure them to your needs.

The rest of this document outlines how you can install and setup the SDK, as
well as how you can use each component and configure it for a given flow.


## Signing up for the MX API

Before getting started, you will need to have your MX client id and API key. Go
to https://dashboard.mx.com if you don't have that information or you
would like to sign up.


## Installing and setting up the SDK

Open a terminal and run the commands below at the root of your project to
install and setup the SDK:

```
npm install --save @mxenabled/mobile-widget-sdk
```

Setup the SDK and link its dependencies:

```
npx mx-mobile-widget-sdk-setup
```

Once the steps above have been completed, you will be able to import components
from the `@mxenabled/mobile-widget-sdk` package and render them in your
application:

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


### Components and props

_TODO_


### OAuth redirects

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
included in the npm package.
