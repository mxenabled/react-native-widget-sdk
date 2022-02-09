import React from "react"
import { View } from "react-native"

import config from "./config.json"
import { ConnectAggregationWidget } from "./src/components/ConnectWidget"

const clientId = config["MX_CLIENT_ID"]
const apiKey = config["MX_API_KEY"]
const userGuid = config["MX_USER_GUID"]
const environment = config["MX_ENVIRONMENT"]

if (!clientId || !apiKey || !userGuid || !environment) {
  const message = `
    Missing configuration. I need the following values defined in config.json:

      - MX_CLIENT_ID
      - MX_API_KEY
      - MX_USER_GUID
      - MX_ENVIRONMENT

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
