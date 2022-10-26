# MX React Native Widget SDK example application

This is a React Native application created with `npx react-native init
MxMobileWidgetDemo --version 0.64.3`. The application's scheme is
`mxwidgetsdkdemo` and was set with `npx uri-scheme add mxwidgetsdkdemo`.


## Running this application

First, you will need to set up your environment so that you can run React
Native apps. See https://reactnative.dev/docs/environment-setup for
instructions on how to do that. Once your environment is setup, run the
following commands:


1. Clone this repository:

  ```console
  git clone https://github.com/mxenabled/react-native-widget-sdk.git
  cd react-native-widget-sdk
  ```

2. Install project dependencies:

  ```console
  npm run example:install
  ```

3. Start the SSO proxy server:

  ```console
  # This command will continue to run until it is manually stopped.
  npm run example:server
  ```

  The example application uses [`@mxenabled/sso-api-proxy`][sso_api_proxy] to
  run a proxy server that talks to MX's Platform API. When the proxy server
  first starts up, it will prompt you to enter the necessary API and user
  settings in order to run. This configuration is then saved locally. See [this
  page][sso_api_proxy_config] for more information on how to configure
  `@mxenabled/sso-api-proxy`.

4. Finally, you can run the application on an iOS or Android simulator.

  ```console
  # This command will continue to run until it is manually stopped.
  npm run example:start

  npm run example:ios     # Run application in an iOS simulator
  npm run example:android # Run application in an Android simulator
  ```


[sso_api_proxy]: https://www.npmjs.com/package/@mxenabled/sso-api-proxy "@mxenabled/sso-api-proxy"
[sso_api_proxy_config]: https://github.com/mxenabled/sso-api-proxy#configuration "Configuration"
