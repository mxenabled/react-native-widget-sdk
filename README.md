# MX React Native Widget SDK

## Introduction

The purpose of this project is to help simplify your integration experience.
Giving you as few steps as possible to get up and running with an MX React
Native widget.

After following the Getting Started instructions below, you will be able to
import and load MX widgets in your React Native application, and configure them
for your specific needs.

## Getting Started

Please refer to the official [MX Docs](https://docs.mx.com/) for an in-depth
explanation of the MX platform. The general outline for incorporating the
`react-native-widget-sdk` into your project is as follow:

- Sign up for a developer account at the developer portal.
- Install and setup the SDK via `npm` or `yarn`.
- Generate an authenticated SSO widget url.
- Import the widget into your project providing it with the needed
  configuration object.

### Acquire your developer account

A developer account can be obtained by signing up on our [Client
Portal](https://dashboard.mx.com) site.

### Installing the SDK

Open a terminal and run the commands below at the root of your project to
install and setup the SDK:

Using npm

```
npm install --save @mxenabled/react-native-widget-sdk
```

Using yarn

```
yarn add @mxenabled/react-native-widget-sdk
```

Once installed, run the command below to finish setting up the SDK's required
dependencies.

```
npx mx-widget-sdk-setup
```

### Generating your Widget SSO URL

See [SSO Widget URL documentation][api_request_widget_url] for instructions. If
loading the Connect Widget, follow the instructions located in [Connect SSO
Widget URL documentation][api_request_connect_url]. The SSO URL should be
passed to a Widget component via the `url` prop.

#### Proxy server

The SDK also has the option of making the SSO request on your behalf to your
backend service that is able to make requests to our API. If used, the proxy
URL should passed to a Widget component via the `proxy` prop.

##### Connect Widget configuration

When you are not using the `proxy` setting, you must pass the widget
configuration in the SSO request that generates the SSO URL. However, when
using the `proxy` setting with the Connect Widget, those configuration settings
may be passed directly to the widget component.

- `colorScheme`: Load the widget in the specified colorScheme; options are
  `light` and `dark`. Defaults to `light`.
- `currentInstitutionCode`: Load the widget into the credential view for the
  specified institution.
- `currentInstitutionGuid`: Load the widget into the credential view for the
  specified institution.
- `currentMemberGuid`: Load to a specific member that contains an error or
  requires MFA from the most recent job. `currentMemberGuid` takes precedence
  over `currentInstitutionCode`.
- `disableInstitutionSearch`: When set to true, the institution search feature
  will be disabled and end users will not be able to navigate to it. Must be
  used with `currentInstitutionCode`, `currentInstitutionGuid`, or
  `currentMemberGuid`.
- `includeTransactions`: When set to false while creating or updating a member,
  transaction data will not be automatically aggregated. Future manual or
  background aggregations will not be affected. Defaults to true.
- `uiMessageWebviewUrlScheme`: Used as the scheme that MX will redirect to at
  the end of OAuth. This must be a scheme that your application responds to.
  See [OAuth redirects](#oauth-redirects) for additional information.
- `updateCredentials`: Loads widget to the update credential view of a current
  member. Optionally used with `currentMemberGuid`. This option should be used
  sparingly. The best practice is to use `currentMemberGuid` and let the widget
  resolve the issue.

```jsx
<ConnectWidget
  proxy={"https://server.com/mx-sso-proxy"}
  colorScheme={"dark"}
  disableInstitutionSearch={true}
/>
```

### Importing the SDK into your project and rendering a widget

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

### Interacting with the widget

You can listen to post message events by passing callback props in the widget
component. The prop names follow this naming scheme:

* For widget events: `on<event name>`,
* For entity events: `on<entity><action>`

For example, the `mx/connect/selectInstitution` event is made available via
`onSelectInstitution` in the `ConnectWidget` component. Refer to [this
document](docs/widget_callback_props.md) for a list of events and their
payloads.

```jsx
<ConnectWidget
  onMessage={(request) => console.log(`Message: ${request.url}`)}
  onSelectedInstitution={(payload) => console.log(`Selecting ${payload.name}`)}
/>
```

### Widget props

You can configure the state and behavior of the widget with the following
component props:

- `language`: Load the widget in the specified language. Defaults to `en-US`.
  See [language
  options](https://docs.mx.com/api#connect_configuring_connect_language_options)
  for additional information.
- `proxy`: SSO proxy server URL.
- `style`: Styles applied to the view containing the widget. See React Native's
  [Style][react_native_style] documentation for additional information.
- `url`: Widget SSO URL. See [Generating your Widget SSO
  URL](#generating-your-widget-sso-url) for additional information. **This prop
  is required.**

#### OAuth redirects in Connect

In order to properly handle OAuth redirects from the Connect widget back to
your application, you will need to do three things:

- Update your application and enable deeplinking from native code into the
  React Native layer. See [Linking](https://reactnative.dev/docs/linking) for
  instructions on how to do that.
- Ensure you application has a scheme. You can install and use the [uri
  scheme](https://www.npmjs.com/package/uri-scheme) package to manage your
  application's schemes.
- Provide your application's scheme to the widget component with the
  `uiMessageWebviewUrlScheme` prop. Expo applications that are not deployed as
  standalone applications should use `clientRedirectUrl` instead, see note
  below.

```jsx
<ConnectWidget uiMessageWebviewUrlScheme="sampleScheme" />
```

**Note for Expo applications:** since Expo applications rely on Expo's own
application scheme, Expo users will need to use the `clientRedirectUrl` prop
instead of `uiMessageWebviewUrlScheme`. Note that this does not apply for
standalone Expo applications, if your application is a standalone application
then you should continue to use the `uiMessageWebviewUrlScheme` prop.

`clientRedirectUrl` works similarly to `uiMessageWebviewUrlScheme`, except you
will need to pass in the full URL to your Expo application and include
`/oauth_complete` at the end of the URL path in order for the Widget SDK to
properly detect the linking event. You can use Expo's `Linking.createURL`
method to create the URL.

```jsx
<ConnectWidget clientRedirectUrl={Linking.createURL("/oauth_complete")} />
```

### Available widget components

This SDK exposes the following components:

- `AccountsWidget`
- `BudgetsWidget`
- `ConnectVerificationWidget`
- `ConnectWidget`
- `ConnectionsWidget`
- `DebtsWidget`
- `FinstrongWidget`
- `GoalsWidget`
- `HelpWidget`
- `MasterWidget`
- `MiniBudgetsWidget`
- `MiniFinstrongWidget`
- `MiniPulseCarouselWidget`
- `MiniSpendingWidget`
- `PulseWidget`
- `SettingsWidget`
- `SpendingWidget`
- `TransactionsWidget`
- `TrendsWidget`

### Troubleshooting

#### Post messages not working

Check the following items if widget post message callbacks are not being
triggered in your application.

- Ensure your SSO request is correctly configured for the React Native SDK:
    - `ui_message_version` should be set to `4`.
    - `is_mobile_webview` should be set to `true`.
- Ensure you are using the corresponding widget component for the `widget_type`
  used in the SSO request. For example, if you set `widget_type` to
  `connect_widget`, then you should use the `ConnectWidget` component.

---

[![Build SDK](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/build-sdk.yml/badge.svg)](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/build-sdk.yml)
[![Build Example App](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/build-example-app.yml/badge.svg)](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/build-example-app.yml)
[![Package Audit SDK](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/package-audit-sdk.yml/badge.svg)](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/package-audit-sdk.yml)
[![Package Audit Example App](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/package-audit-example-app.yml/badge.svg)](https://github.com/mxenabled/react-native-widget-sdk/actions/workflows/package-audit-example-app.yml)

[api_request_widget_url]: https://docs.mx.com/api#widgets_mx_widgets_request_widget_url "Request a widget URL"
[api_request_connect_url]: https://docs.mx.com/api#connect_request_a_url "Request a Connect URL"
[react_native_style]: https://reactnative.dev/docs/style "React Native Style"
