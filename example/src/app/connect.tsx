import React, { useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as Linking from "expo-linking"

import { ConnectWidget } from "@mxenabled/react-native-widget-sdk"
import { fetchConnectWidgetUrl } from "../shared/api"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
})

export default function Connect() {
  const clientRedirectUrl = Linking.createURL("connect")

  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchConnectWidgetUrl(clientRedirectUrl).then((url) => {
      setUrl(url)
    })
  }, [clientRedirectUrl])

  return (
    <SafeAreaView style={styles.page}>
      {url && (
        <ConnectWidget
          url={url}
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
          onOAuthRequested={(payload) => {
            console.log(`OAuth requested with URL: ${payload.url}`)
          }}
          onStepChange={(payload) => {
            console.log(`Moving from ${payload.previous} to ${payload.current}`)
          }}
          onSelectedInstitution={(payload) => {
            console.log(`Selecting ${payload.name}`)
          }}
        />
      )}
    </SafeAreaView>
  )
}
