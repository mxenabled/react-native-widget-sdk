import React from "react"
import { View } from "react-native"

import { ConnectAggregationWidget } from "@mxenabled/react-native-widget-sdk"
import config from "./config.json"

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ConnectAggregationWidget
        {...config}

        uiMessageWebviewUrlScheme="mxwidgetsdkdemo"
        onMessage={(request) => {
          console.log(`Got a message: ${request.url}`)
        }}
        onUnknownMessage={(request) => {
          console.log(`Unknown request intercepted: ${request.url}`)
        }}
        onMessageDispatchError={(request, error) => {
          console.log(`Error dispatching post message: ${request.url}`)
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
      />
    </View>
  )
}
