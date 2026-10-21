import React from "react"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { SpendingWidget } from "@mxenabled/react-native-widget-sdk"
import { proxy } from "../shared/proxy"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
})

export default function Spending() {
  return (
    <SafeAreaView style={styles.page}>
      <SpendingWidget proxy={proxy} />
    </SafeAreaView>
  )
}
