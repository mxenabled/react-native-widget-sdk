import React from "react"
import { SafeAreaView, StyleSheet, Platform } from "react-native"

import { PulseWidget } from "@mxenabled/react-native-widget-sdk"

const baseUrl = Platform.OS === "android" ? "http://10.0.2.2:8089" : "http://localhost:8089"
const proxy = `${baseUrl}/user/widget_urls`

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
})

export default function Pulse() {
  return (
    <SafeAreaView style={styles.page}>
      <PulseWidget proxy={proxy} />
    </SafeAreaView>
  )
}
