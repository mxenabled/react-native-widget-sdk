# MX React Native Widget SDK

## Introduction 

The purpose of this project is to help simplify your integration experience. Giving you as few steps as possible to get up and running with an authenticated MX React Native widget.

After following the Getting Started instructions below, you will be able to import and load MX widgets in your React Native application, and configure them to your needs.  
The rest of this document outlines how to install and setup the SDK, as well as how you can use each component and configure it for a given flow.

## Requirements

TODO: add requirements
## Getting Started

The general overview for incorportating the `react-native-widget-sdk` into your project is as follow:

* Aquire your platform `client_id` and `api_key`.
* Install the SDK via npm.
* Generate an authenticated SSO widget url.
* Import the widget into your project providing it with the needed configuration including the SSO URL.
* Interact with the widget via `postMessages` and callback function props.

### Aquiring Platform keys

You will need to have your MX `client_id` and `api_key` to setup the widget.  
Those can be obtained after signing up on the https://dashboard.mx.com site.  
You'll find them under the "API keys and whitelisting" section.

### Installing the SDK

Open a terminal and run the commands below at the root of your project to
install and setup the SDK:

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

## License

MIT License

Copyright (c) 2022 MX 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.