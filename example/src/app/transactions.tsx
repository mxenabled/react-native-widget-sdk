import React from "react"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { TransactionsWidget } from "@mxenabled/react-native-widget-sdk"
import { proxy } from "../shared/proxy"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
})

export default function Transactions() {
  return (
    <SafeAreaView style={styles.page}>
      <TransactionsWidget proxy={proxy} />
    </SafeAreaView>
  )
}
