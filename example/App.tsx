import React, { useState, FC } from "react"
import { SafeAreaView, Text, View, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { NativeRouter, Routes, Route, Link as RouteLink } from "react-router-native"

import {
  BudgetsWidget,
  ConnectWidget,
  GoalsWidget,
  PulseWidget,
  SpendingWidget,
  TransactionsWidget,
} from "@mxenabled/react-native-widget-sdk"

import config from "./config.json"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },
  heading: {
    paddingLeft: 25,
  },
  nav: {},
  navItem: {
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    margin: 10,
    padding: 20,
  },
  navItemNormalText: {
    color: "#2980b9",
    fontSize: 20,
  },
  navItemSmallText: {
    color: "#2980b9",
    fontSize: 15,
  },
})

export default function App() {
  return (
    <NativeRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/pulse" element={<Pulse />} />
        <Route path="/spending" element={<Spending />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </NativeRouter>
  )
}

const Home = () => (
  <Page style={styles.nav} goBack={false}>
    <Link to="/connect">Load Connect Widget</Link>
    <Link to="/budgets">Load Budgets Widget</Link>
    <Link to="/goals">Load Goals Widget</Link>
    <Link to="/pulse">Load Pulse Widget</Link>
    <Link to="/spending">Load Spending Widget</Link>
    <Link to="/transactions">Load Transactions Widget</Link>
  </Page>
)

const Page: FC<{ style?: StyleProp<ViewStyle>; goBack?: boolean }> = ({
  children,
  style,
  goBack = true,
}) => (
  <SafeAreaView style={styles.page}>
    {goBack ? (
      <View style={styles.heading}>
        <RouteLink underlayColor="#ffffff" to="/">
          <Text style={styles.navItemSmallText}>Back</Text>
        </RouteLink>
      </View>
    ) : null}
    {children}
  </SafeAreaView>
)

const Link: FC<{ to: string }> = ({ to, children }) => (
  <RouteLink underlayColor="#f0f4f7" to={to} style={styles.navItem}>
    <Text style={styles.navItemNormalText}>{children}</Text>
  </RouteLink>
)

const Connect = () => {
  return (
    <Page>
      <ConnectWidget
        {...config}
        uiMessageWebviewUrlScheme="mxwidgetsdkdemo"
        onSsoUrlLoadError={(error) => {
          console.error(`SSO URL load error: ${error}`)
        }}
        onMessage={(url) => {
          console.log(`Got a message: ${url}`)
        }}
        onInvalidMessageError={(url, _error) => {
          console.log(`Got an unknown message: ${url}`)
        }}
        onLoad={(payload) => {
          console.log("Widget is loading")
        }}
        onLoaded={(payload) => {
          console.log("Widget has loaded")
        }}
        onStepChange={(payload) => {
          console.log(`Moving from ${payload.previous} to ${payload.current}`)
        }}
        onSelectedInstitution={(payload) => {
          console.log(`Selecting ${payload.name}`)
        }}
      />
    </Page>
  )
}

const Budgets = () => {
  return (
    <Page>
      <BudgetsWidget {...config} />
    </Page>
  )
}

const Goals = () => {
  return (
    <Page>
      <GoalsWidget {...config} />
    </Page>
  )
}

const Pulse = () => {
  return (
    <Page>
      <PulseWidget {...config} />
    </Page>
  )
}

const Spending = () => {
  return (
    <Page>
      <SpendingWidget {...config} />
    </Page>
  )
}

const Transactions = () => {
  return (
    <Page>
      <TransactionsWidget {...config} />
    </Page>
  )
}
