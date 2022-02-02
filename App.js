import React from "react"
import { View } from "react-native"
import Config from "react-native-config"
import ConnectWidget from "./src/components/ConnectWidget"

export default function App() {
  const onLoaded = (payload) => {
    console.log("Connect has loaded")
  }

  const onStepChange = (payload) => {
    console.log(`Moving from ${payload.previous} to ${payload.current}`)
  }

  const onSelectedInstitution = (payload) => {
    console.log(`Selecting ${payload.name}`)
  }

  return (
    <View style={{ flex: 1 }}>
      <ConnectWidget
        clientId={Config.MX_CLIENT_ID}
        apiKey={Config.MX_API_KEY}
        userGuid={Config.MX_USER_GUID}
        environment={Config.MX_ENVIRONMENT}
        onLoaded={onLoaded}
        onStepChange={onStepChange}
        onSelectedInstitution={onSelectedInstitution}
      />
    </View>
  )
}
