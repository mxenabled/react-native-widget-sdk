# QA

Below you will find instructions on how to test the MX React Native Widget SDK.
This document is broken up into a section that outlines what is needed for the
full test suite, and another section that outlines what is needed for no-harm
test suite.

## Prerequisites

You will need to [setup your local environment](./setup.md) and the [example
application](./../example/README.md).


## Full test suite

Tests should be ran in an iOS (`npm run ios`) and an Android emulator (`npm run
android`).

- **Loading Connect**: there are three ways of loading a widget in the SDK:
  through the Platform API, using a proxy server, and using a hard-coded URL.
  All of these methods can be used in the example application, they simply
  require that you modify the `config.json` file with the appropriate fields
  and values and load the application. The items below list the various loading
  methods and the fields that are required in the `config.json` file in order
  to use them. For each of these methods, you will need to open the
  `config.json` file, remove (or rename) existing fields, and defined the ones
  required by the method. Once that is done, you should run the application and
  ensure the widget loads.
    - **Using the Platform API**: you will need to define `clientId`, `apiKey`,
    `userGuid`, and `environment` (`environment` should be `"integration"` or
    `"production"`) in `config.json`. You can get all of these values in the
    client portal or in Batcave.
    - **Using a hard-coded URL**: you will need to define a `url` in
    `config.json`. This is an SSO widget URL that you can get the URL through
    curl or postman.
    - **Using a proxy server**: you will need to define `proxy` in
    `config.json`. See https://gitlab.mx.com/mx/widget-sso-api-proxy for
    instructions on how to set up a proxy server for the Platform API. Once the
    server is up and running set `proxy` to
    `"http://localhost:8089/connect_widget/<user guid>"`.
- **Post message integration**: when you first load the application, ensure
  that you see "Connect has loaded" in the terminal opened when you start up
  the application. This message is logged via a callback that is triggered by
  the `mx/connect/loaded` post message and ensure that the post message
  integration is working as expected.
- **Connect an institution**: ensure that you are able to connect and aggregate
  any institution.
- **OAuth**
    - **New member flow**: for this test you will need a user that has not
    previously connected to an institution that uses OAuth. You can delete
    existing members to get to this "new member" state. Sign in to the
    institution and ensure the following:
        - **Authorize flow**
            - After you click the Sign In button in Connect, ensure a new
            browser window opens and you are prompted to authorize or deny
            access.
            - When you click authorize, ensure you are to the application. On
            iOS you will have to click "Open" before you are taken back to the
            app.
            - After landing back in the demo application, ensure that Connect
            is able to successfully connect the new member.
        - **Deny flow**
            - After you click the Sign In button in Connect, ensure a new
            browser window opens and you are prompted to authorize or deny
            access.
            - When you click deny, ensure you are to the application. On iOS
            you will have to click "Open" before you are taken back to the app.
            - After landing back in the demo application, ensure that Connect
            [TODO].
    - **Existing member flow**: for this test you will need a user that has
    previously connected to an institution that uses OAuth. You can connect to
    institution twice to get to this "existing member" state. Sign in to the
    institution and ensure the following:
        - **Authorize flow**: ensure this works the same the Authorize flow
        under the New member flow. The only difference is that you will have to
        confirm that you have already connected to that institution and would
        like to continue.
        - **Deny flow**: ensure this works the same the Deny flow under the New
        member flow. The only difference is that you will have to confirm that
        you have already connected to that institution and would like to
        continue.

## No-harm test suite

We should run through the following tests (which are outlined in the section
above) When doing no-harm testing:

- **Loading Connect** using any loading method: see section above for
  instructions.
- **Post message integration**: see section above for instructions.
- **OAuth new member authorize flow** *or* **OAuth existing member authorize
  flow**: see section above for instructions.
