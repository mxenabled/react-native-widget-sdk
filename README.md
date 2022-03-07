# MX React Native Widget SDK

## Introduction

The purpose of this project is to help simplify your integration experience.
Giving you as few steps as possible to get up and running with an MX React
Native widget.

After following the Getting Started instructions below, you will be able to import and load MX widgets in your React Native application, and configure them for your specific needs.

## Getting Started

Please refer to the offical [MX Docs](https://docs.mx.com/) for an in-depth
explanation of the MX platform. The general outline for incorportating the
`react-native-widget-sdk` into your project is as follow:

* Signup for a developer account at the developer portal.
* Install and setup the SDK via `npm` or `yarn`.
* Generate an authenticated SSO widget url.
* Import the widget into your project providing it with the needed configuration object.

###  Aquire your developer account

A developer account can be obtained by signing up on our [Client Portal](https://dashboard.mx.com) site.

### Installing the SDK

Open a terminal and run the commands below at the root of your project to install and setup the SDK:

Using npm
```
npm install --save @mxenabled/react-native-widget-sdk
```

Using yarn
```
yarn add @mxenabled/react-native-widget-sdk
```

Once installed, run the command below to finish setting up the SDK's required dependencies.

```
npx mx-widget-sdk-setup
```

### Generating your Widget SSO URL

See [SSO Widget URL documentation](https://docs.mx.com/api#widgets_mx_widgets_request_widget_url)
for instructions. If loading the Connect Widget, follow the instructions
located the [Connect SSO Widget URL documentation](https://docs.mx.com/api#connect_request_a_url).

### Importing the SDK into your project

Once the steps above have been completed, you will be able to import components
from the `@mxenabled/react-native-widget-sdk` package and render them in your
application:

```jsx
import React from "react"

import { ConnectWidget } from "@mxenabled/react-native-widget-sdk"

export default function App() {
  return (
    <ConnectWidget
      onLoaded={() => console.log("Connect Widget Loaded")}
      url="https://widgets.moneydesktop.com/md/connect/..."
    />
  )
}
```

### Interacting with the Widget

You can listen to post message events by passing callback props in the widget component. The prop names follow this naming scheme:
* For widget events: `on<event name>`,
* For entity events: `on<entity><action>`

For example, the `mx/connect/selectInstitution` event is made available via `onSelectInstitution` in the ConnectWidget component. See [handing events](https://docs.mx.com/api#connect_postmessage_events) for a list of events and their payloads.

```jsx
<ConnectWidget
  onMessage={(request) => console.log(`Message: ${request.url}`)}
  onSelectedInstitution={(payload) => console.log(`Selecting ${payload.name}`)}
/>
```
### OAuth redirects

In order to properly handle OAuth redirects from the Connect widget back to
your application, you will need to do three things:

- Update your application and enable deeplinking from native code into the
  React Native layer. See [Linking](https://reactnative.dev/docs/linking) for instructions on how to do that.
- Ensure you application has a scheme. You can install and use the [uri scheme](https://www.npmjs.com/package/uri-scheme) package to manage your application's schemes.
- Provde your application's scheme to the widget component with the
  `uiMessageWebviewUrlScheme` prop.

```jsx
<ConnectWidget uiMessageWebviewUrlScheme="sampleScheme" />
```

---

[![Build](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/build.yml/badge.svg)](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/build.yml)
