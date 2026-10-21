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
`EXPO_PUBLIC_PROXY_BASE_URL=http://192.168.1.20:8089 npm run android:e2e`. The value is compiled into the
JS bundle, so after changing it for a release build, clear the caches (`./gradlew clean`, `npx expo start --clear`).

## CI (Sauce Labs)

[`.github/workflows/e2e-sauce-labs.yml`](.github/workflows/e2e-sauce-labs.yml) runs the same flows on a
Sauce Labs Android device. It runs on pull requests and pushes to `v4` and `master` that touch the SDK
(`src/`, its build config, the package files), `example/`, or the workflow itself.

What it does:

1. **`build-android`** builds the SDK and the example app as a release APK, with the JS bundled so no Metro
   server is needed, and with `EXPO_PUBLIC_PROXY_BASE_URL=http://sdk-e2e-proxy:8089`. The example app allows
   cleartext http (`usesCleartextTraffic` in `example/app.json`) so the release build can reach the proxy.
   The APK is signed with the debug keystore; it's for testing only. This job needs no secrets, so it runs
   even when the tests are skipped.
2. **`test-android`** starts the SSO proxy on the runner, with `sdk-e2e-proxy` pointed at `127.0.0.1` in
   `/etc/hosts`.
3. It opens a [Sauce Connect](https://docs.saucelabs.com/secure-connections/sauce-connect-5/) tunnel that
   carries only `sdk-e2e-proxy` traffic from the device to the runner. Sauce Connect can't proxy `localhost`
   to real devices, which is why the alias is needed.
4. It uploads the APK to Sauce Labs App Storage and runs `example/maestro/` with
   [maestro-runner](https://docs.saucelabs.com/basics/community-frameworks/maestro/), a community tool that
   runs Maestro flows through Appium. Device capabilities are in `example/sauce/*.json`.
5. It uploads the HTML, JUnit and Allure report as the `maestro-report-<target>` artifact, with the Sauce
   access key redacted, and deletes the APK from App Storage.

The SSO proxy and maestro-runner versions are pinned in `example/sauce/package.json` (and its lockfile). To
upgrade maestro-runner, change the version there and run `npm install` in `example/sauce`.

### Running it manually

The workflow can be started by hand, which is also the only way to run it on a real device. GitHub only
offers this once the workflow file is on the default branch (`master`). From then on, use **Actions > E2E
tests (Sauce Labs) > Run workflow**, or:

```
gh workflow run e2e-sauce-labs.yml --ref <branch> -f target=android-real-device
```

### Required configuration

Repository secrets (Settings > Secrets and variables > Actions):

| Secret             | Value                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `SAUCE_USERNAME`   | Sauce Labs username. Prefer a service user over a personal account.                                   |
| `SAUCE_ACCESS_KEY` | That user's access key                                                                                |
| `MX_CLIENT_ID`     | Client ID of the E2E test client (see [`.mx-sso-proxy-rc.example.yml`](.mx-sso-proxy-rc.example.yml)) |
| `MX_API_KEY`       | API key of the same client                                                                            |

If any of them is missing, the workflow still builds the APK but skips the Sauce Labs tests and passes, with
a notice saying which secrets are missing. That is also what happens on pull requests from forks and from
Dependabot, which don't get repository secrets.

Optional repository variables:

| Variable               | Default                                    | Notes                                                                                                                                 |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `SAUCE_REGION`         | `us-west-1`                                | The data center of the Sauce account: `us-west-1`, `eu-central-1` or `us-east-4`. Use the full name; `us` or `eu-central` won't work. |
| `MX_API_HOST`          | `https://int-api.mx.com`                   |                                                                                                                                       |
| `MX_DEFAULT_USER_GUID` | `USR-e7353471-51d7-447f-b621-db255148a10c` | The user the proxy creates widget URLs for                                                                                            |

### When it fails

- **Which flow failed, and why:** download the `maestro-report-<target>` artifact from the run and open the
  HTML report, which has each flow's steps and screenshots. `maestro-runner.log` in the artifact has the
  full run.
- **Video and device logs:** in Sauce Labs, open **Automated > Test Results** (emulators) or **Real
  Devices**, and filter by the build `rn-sdk-e2e-<run id>-<attempt>`. maestro-runner reuses a session for
  several flows, so a Sauce job can contain more than one flow; it's named after the first one. Use the
  report's timestamps to find a flow in the video.
- **"SSO proxy didn't return a widget URL":** the proxy couldn't get a widget URL from the MX API. Usually
  `MX_CLIENT_ID` / `MX_API_KEY` are wrong or rotated, or `MX_API_HOST` is wrong. The **SSO proxy log** step
  shows the requests and status codes (the full log isn't printed because it can contain the credentials).
- **Every flow fails at its first widget screen:** the device probably couldn't reach the proxy. Check the
  **SSO proxy log** step: if it has no `POST /user/widget_urls` lines from the test run, the requests never
  reached the runner (tunnel, alias or cleartext problem).
- **The Maestro step fails before any flow runs:** Sauce couldn't start a session (no free concurrency, an
  emulator that didn't boot, a Sauce outage). Re-run the failed jobs.
