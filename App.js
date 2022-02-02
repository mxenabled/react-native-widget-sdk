import React from "react"
import { View } from "react-native"
import Config from "react-native-config"
import ConnectWidget from "./src/components/ConnectWidget"

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ConnectWidget
        clientId={Config.MX_CLIENT_ID}
        apiKey={Config.MX_API_KEY}
        userGuid={Config.MX_USER_GUID}
        environment={Config.MX_ENVIRONMENT}
      />
    </View>
  )
}
