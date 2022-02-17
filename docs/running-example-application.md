### Running the example application

First, you will need to set up your environment so that you can run React
Native apps. See [`./environment-setup.md`](./environment-setup.md) or
https://reactnative.dev/docs/environment-setup for instructions on how to do
that.

Once your environment is setup, clone the repo and cd into the example
directory within it:

```
git clone https://gitlab.mx.com/mx/mobile-widget-sdk-react-native.git
cd mobile-widget-sdk-react-native
cd example
```

Create an open `config.json` file in the example directory:

```
touch config.json
open -a TextEdit config.json
```

And copy and paste the JSON below into your `config.json` file and save after
filling in the appropriate values for MX_CLIENT_ID, MX_API_KEY, MX_USER_GUID,
and MX_ENVIRONMENT (MX_ENVIRONMENT should be "integration" or "production").

```json
{
  "MX_CLIENT_ID": "...",
  "MX_API_KEY": "...",
  "MX_USER_GUID": "...",
  "MX_ENVIRONMENT": "integration"
}
```

Next, install dependencies for iOS and React Native:

```
npm install
```

Finally, you can run the application on an iOS or Android simulator.

```
npm run ios
npm run android
```
