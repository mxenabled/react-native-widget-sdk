import React from "react"
import { View } from "react-native"

import { ConnectAggregationWidget } from "@mxenabled/mobile-widget-sdk"
import { clientId, apiKey, userGuid, environment } from "./config.json"

const platformApiProps = clientId && apiKey && userGuid && environment

if (!platformApiProps) {
  const message = `
    Missing configuration. I need the following values defined in config.json:

      - clientId
      - apiKey
      - userGuid
      - environment

    See README for instructions.`

  throw new Error(message)
}

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ConnectAggregationWidget
        clientId={clientId}
        apiKey={apiKey}
        userGuid={userGuid}
        environment={environment}
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
