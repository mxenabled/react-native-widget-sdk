# MX React Native Widget SDK example application

This is a React Native application created with `npx react-native init
MxMobileWidgetDemo --version 0.64.3`. The application's scheme is
`mxwidgetsdkdemo` and was set with `npx uri-scheme add mxwidgetsdkdemo`.


## Running this application

First, you will need to set up your environment so that you can run React
Native apps. See https://reactnative.dev/docs/environment-setup for
instructions on how to do that. Once your environment is setup, clone the repo
and cd into the example directory within it:

```
git clone https://github.com/mxenabled/react-native-widget-sdk.git
cd react-native-widget-sdk
cd example
```

Create an open `config.json` file in the example directory:

```
touch config.json
open -a TextEdit config.json
```

And copy and paste the JSON below into your `config.json` file and save after
filling in the appropriate values for `clientId`, `apiKey`, `userGuid`, and
`environment` (`environment` should be `"integration"` or `"production"`).

```json
{
  "clientId": "...",
  "apiKey": "...",
  "userGuid": "...",
  "environment": "integration"
}
```

Next, install dependencies for iOS and React Native:

```
npm install
cd ios; pod install; cd -
cd ..;  npm install; cd -
```

Finally, you can run the application on an iOS or Android simulator.

```
npm run ios
npm run android
```
