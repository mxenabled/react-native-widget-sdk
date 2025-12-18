# Local Development

This repository includes an example app built with Expo for local development and testing.

## Development Setup

### 1. Clone this repository

### 2. Install dependencies

```bash
npm install
```

### 3. Set up React Native

Follow the [React Native environment setup guide](https://reactnative.dev/docs/set-up-your-environment).

### 4. Install example project dependencies

```bash
cd example
npm install
```

### 5. Configure the SSO API proxy

The example application uses [`@mxenabled/sso-api-proxy`][sso_api_proxy] to run a proxy server that communicates with MX's Platform API.

When the proxy server first starts up, it will prompt you to enter the necessary API and user settings. This configuration is then saved locally.

See the [configuration documentation][sso_api_proxy_config] for more information on how to configure `@mxenabled/sso-api-proxy`.

[sso_api_proxy]: https://www.npmjs.com/package/@mxenabled/sso-api-proxy "@mxenabled/sso-api-proxy"
[sso_api_proxy_config]: https://github.com/mxenabled/sso-api-proxy#configuration "Configuration"

### 6. Start the development dependencies

This will start an SSO proxy server and watch for changes to the SDK:

```bash
npm run dev:dependencies
```

### 7. Run the application

Finally, run the application on an iOS or Android simulator:

```bash
npm run dev
```
