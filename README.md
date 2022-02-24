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
npm install --save @mxenabled/react-native-widget-sdk
```

Setup the SDK and link its dependencies:

```
npx mx-widget-sdk-setup
```

Once the steps above have been completed, you will be able to import components
from the `@mxenabled/react-native-widget-sdk` package and render them in your
application:

```jsx
import React from "react"

import { ConnectWidget } from "@mxenabled/react-native-widget-sdk"

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


## Development

Once you have [Node v16](https://nodejs.org/en/download/) installed, you can
use the commands listed below to perform various tasks:

- `npm install`, install depedencies.
- `npm run build`, run compiler, does not generate assets in `dist` directory.
- `npm run build:dist`, run compile and save assets to `dist` directory.
- `npm run test`, run unit tests.
- `npm run test:coverage`, run unit tests and generate code coverage report.
- `npm run open:coverage`, open code coverage report.
- `npm run generate`, run code generators.

### Publishing to npm

You will need permission to publish to the
[mxenabled](https://www.npmjs.com/org/mxenabled) organization in npm before you
can publish this package.

Once you are able to publish, log into npm with `npm login` then run `npm
publish` to publish. Running `npm publish` will automatically execute `npm run
build:dist` for you, so there is no need to do that manually.
