import React from "react"
import { StyleSheet, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { BudgetsWidget } from "@mxenabled/react-native-widget-sdk"

const baseUrl = Platform.OS === "android" ? "http://10.0.2.2:8089" : "http://localhost:8089"
const proxy = `${baseUrl}/user/widget_urls`

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
})

export default function Budgets() {
  return (
    <SafeAreaView style={styles.page}>
      <BudgetsWidget proxy={proxy} />
    </SafeAreaView>
  )
}
