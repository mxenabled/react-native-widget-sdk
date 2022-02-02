import React from "react"
import { View } from "react-native"
import Config from "react-native-config"
import ConnectWidget from "./src/components/ConnectWidget"

export default function App() {
  const onMessage = (type, payload) => {
    console.log(`Received ${type} message (${JSON.stringify(payload)})`)
  }

  const onLoaded = (payload) => {
    console.log("Connect has loaded")
  }

  return (
    <View style={{ flex: 1 }}>
      <ConnectWidget
        clientId={Config.MX_CLIENT_ID}
        apiKey={Config.MX_API_KEY}
        userGuid={Config.MX_USER_GUID}
        environment={Config.MX_ENVIRONMENT}
        onMessage={onMessage}
        onLoaded={onLoaded}
      />
    </View>
  )
}
