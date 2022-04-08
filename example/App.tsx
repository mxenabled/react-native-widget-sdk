import React from "react"
import { View } from "react-native"

import { ConnectWidget } from "@mxenabled/react-native-widget-sdk"
import config from "./config.json"

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ConnectWidget
        {...config}

        onSsoUrlLoadError={(error) => {
          console.error(error)
        }}

        uiMessageWebviewUrlScheme="mxwidgetsdkdemo"
        onMessage={(url) => {
          console.log(`Got a message: ${url}`)
        }}
        onInvalidMessageError={(url, _error) => {
          console.log(`Unknown request intercepted: ${url}`)
        }}
        onLoad={(payload) => {
          console.log("Widget is loading")
        }}
        onLoaded={(payload) => {
          console.log("Connect has loaded")
        }}
        onStepChange={(payload) => {
          console.log(`Moving from ${payload.previous} to ${payload.current}`)
        }}
        onSelectedInstitution={(payload) => {
          console.log(`Selecting ${payload.name}`)
        }}
        onFocusTrap={(payload) => {
          console.log(`Focus trap ${payload.user_guid}`)
        }}
      />
    </View>
  )
}
