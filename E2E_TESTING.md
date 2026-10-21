# E2E Testing

We use Maestro for E2E testing.

## Local setup

### 1. [Install maestro](https://docs.maestro.dev/getting-started/installing-maestro)

### 2. Run an E2E friendly version of the app

```
    # Run from the example folder
    npm run android:e2e
    # Or
    npm run ios:e2e
```

### 3. Run the E2E tests

```
    # Run from the example folder
    npm run e2e
```

The example app talks to the SSO proxy started by `npm run dev:dependencies` (see
[DEVELOPMENT.md](DEVELOPMENT.md)). To point it somewhere else, set
`EXPO_PUBLIC_PROXY_BASE_URL` when you build or start the app, for example
`EXPO_PUBLIC_PROXY_BASE_URL=http://192.168.1.20:8089 npm run android:e2e`.

## CI (Sauce Labs)

[`.github/workflows/e2e-sauce-labs.yml`](.github/workflows/e2e-sauce-labs.yml) runs the same flows on a
Sauce Labs device for pull requests that touch `src/`, `example/` or the package files. You can also run
it from the Actions tab, where you can choose between an Android emulator and an Android real device.

What it does:

1. Builds the SDK and the example app as a release APK, so the JS is bundled and no Metro server is needed.
   The app is built with `EXPO_PUBLIC_PROXY_BASE_URL=http://sdk-e2e-proxy:8089`. This job needs no secrets
   and always runs.
2. Starts the SSO proxy on the runner, with `sdk-e2e-proxy` pointed at `127.0.0.1` in `/etc/hosts`.
3. Opens a [Sauce Connect](https://docs.saucelabs.com/secure-connections/sauce-connect-5/) tunnel, so the
   device's requests to `sdk-e2e-proxy` reach the runner. Sauce Connect can't proxy `localhost` to real
   devices, which is why the alias is needed.
4. Uploads the APK to Sauce Labs App Storage, then runs `example/maestro/` with
   [maestro-runner](https://docs.saucelabs.com/basics/community-frameworks/maestro/), which runs Maestro
   flows through Appium. Device capabilities are in `example/sauce/`.
5. Uploads the HTML and JUnit report as the `maestro-report-*` artifact, with files containing the Sauce
   access key removed, and deletes the APK from App Storage.

Each flow shows up in Sauce Labs under **Automated > Test Results** (emulators) or **Real Devices**, in a
build named `rn-sdk-e2e-<run id>-<attempt>`, with video and logs.

### Required configuration

Repository secrets (Settings > Secrets and variables > Actions):

| Secret             | Value                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `SAUCE_USERNAME`   | Sauce Labs username                                                                                   |
| `SAUCE_ACCESS_KEY` | Sauce Labs access key                                                                                 |
| `MX_CLIENT_ID`     | Client ID of the E2E test client (see [`.mx-sso-proxy-rc.example.yml`](.mx-sso-proxy-rc.example.yml)) |
| `MX_API_KEY`       | API key of the same client                                                                            |

If any of them is missing, the workflow still builds the APK but skips the Sauce Labs tests and passes, with
a notice saying which secrets are missing. That is also what happens on pull requests from forks and from
Dependabot, which don't get repository secrets.

Optional repository variables:

| Variable               | Default                                    |
| ---------------------- | ------------------------------------------ |
| `SAUCE_REGION`         | `us-west-1`                                |
| `MX_API_HOST`          | `https://int-api.mx.com`                   |
| `MX_DEFAULT_USER_GUID` | `USR-e7353471-51d7-447f-b621-db255148a10c` |
