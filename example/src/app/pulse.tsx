import React from "react"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PulseWidget } from "@mxenabled/react-native-widget-sdk"
import { proxy } from "../shared/proxy"

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
