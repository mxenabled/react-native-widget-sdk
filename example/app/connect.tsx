import React from "react"
import { StyleSheet, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Linking from "expo-linking"

import { ConnectWidget } from "@mxenabled/react-native-widget-sdk"

const baseUrl = Platform.OS === "android" ? "http://10.0.2.2:8089" : "http://localhost:8089"
const proxy = `${baseUrl}/user/widget_urls`

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
})

export default function Connect() {
  const clientRedirectUrl = Linking.createURL("connect")

  return (
    <SafeAreaView style={styles.page}>
      <ConnectWidget
        proxy={proxy}
        clientRedirectUrl={clientRedirectUrl}
        onSsoUrlLoadError={(error) => {
          console.error(`SSO URL load error: ${error}`)
        }}
        onMessage={(url) => {
          console.log(`Got a message: ${url}`)
        }}
        onInvalidMessageError={(url, _error) => {
          console.log(`Got an unknown message: ${url}`)
        }}
        onLoad={(_payload) => {
          console.log("Widget is loading")
        }}
        onLoaded={(_payload) => {
          console.log("Widget has loaded")
        }}
        onMemberConnected={(payload) => {
          console.log(`Member connected with payload: ${JSON.stringify(payload)}`)
        }}
        onStepChange={(payload) => {
          console.log(`Moving from ${payload.previous} to ${payload.current}`)
        }}
        onSelectedInstitution={(payload) => {
          console.log(`Selecting ${payload.name}`)
        }}
      />
    </SafeAreaView>
  )
}
