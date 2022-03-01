# MX React Native Widget SDK

## Introduction 

The purpose of this project is to help simplify your integration experience. Giving you as few steps as possible to get up and running with an authenticated MX React Native widget.

After following the Getting Started instructions below, you will be able to import and load MX widgets in your React Native application, and configure them for your specific needs.  

## Requirements

* [Node v16](https://nodejs.org/en/download/)

TODO: add requirements
## Getting Started

Please refer to the offical [MX Docs](https://docs.mx.com/) for an in-depth explanation of the MX platform.   

The general outline for incorportating the `react-native-widget-sdk` into your project is as follow:

* Acquire your platform `client_id` and `api_key`.
* Install the SDK via npm.
* Generate an authenticated SSO widget url.
* Import the widget into your project providing it with the needed configuration including the SSO URL.
* Interact with the widget via `window.postMessage` and callback function props.

### Acquiring Platform keys

You will need to have your MX `client_id` and `api_key` to setup the widget.  
Those can be obtained after signing up on our [Client Portal](https://dashboard.mx.com) site.  
You'll find them under the "API keys and whitelisting" section.

### Installing the SDK

Open a terminal and run the commands below at the root of your project to
install and setup the SDK:

Using yarn
```
yarn add @mxenabled/react-native-widget-sdk
```

Using npm
```
npm install --save @mxenabled/react-native-widget-sdk
```

### Setting up the SDK

Installing the SDK's dependencies and setting up required linking:

```
npx mx-widget-sdk-setup
```
### Generating your Widget SSO URL

TODO: add description and link to offical documentation

### Including the SDK in your project  

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

### Interacting with the Widget

TODO: add how to postmessage/function callbacks
### Components and props

TODO

### OAuth redirects

In order to properly handle OAuth redirects from the Connect widget back to
your application, you will need to do three things:

- Update your application and enable deeplinking from native code into the
  React Native layer. See [Linking](https://reactnative.dev/docs/linking) for instructions on how to do that.
- Ensure you application has a scheme. You can install and use the [uri scheme](https://www.npmjs.com/package/uri-scheme) package to manage your application'sschemes.
- Provde your application's scheme to the widget component with the
  `uiMessageWebviewUrlScheme` prop.

```jsx
<ConnectWidget uiMessageWebviewUrlScheme="sampleScheme" />
```

### Development

This package is written in TypeScript, so if you're developing your application
in TypeScript you will be able to leverage all of the type definitions that are
included in the npm package.

You can use the commands listed below to perform various tasks:

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
