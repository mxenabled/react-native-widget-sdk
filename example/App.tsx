import React, { useState, FC } from "react"
import { SafeAreaView, Text, View, StyleSheet, StyleProp, ViewStyle } from "react-native"
import { NativeRouter, Routes, Route, Link } from "react-router-native"

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
    paddingTop: 10,
  },
  heading: {
    paddingLeft: 25,
  },
  navigation: {
    flex: 1,
    flexWrap: "wrap",
    padding: 10,
  },
  navigationButton: {
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    margin: 10,
    padding: 20,
  },
  navItemNormalText: {
    color: "#2980b9",
    fontSize: 20,
  },
  back: {
    color: "#2980b9",
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
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
  <Page style={styles.navigation} goBack={false}>
    <NavigationButton to="/connect">Connect</NavigationButton>
    <NavigationButton to="/budgets">Budgets</NavigationButton>
    <NavigationButton to="/goals">Goals</NavigationButton>
    <NavigationButton to="/pulse">Pulse</NavigationButton>
    <NavigationButton to="/spending">Spending</NavigationButton>
    <NavigationButton to="/transactions">Transactions</NavigationButton>
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
        <Link underlayColor="#ffffff" to="/">
          <Text style={styles.back}>Back</Text>
        </Link>
      </View>
    ) : null}
    {children}
  </SafeAreaView>
)

const NavigationButton: FC<{ to: string }> = ({ to, children }) => (
  <Link underlayColor="#f0f4f7" to={to} style={styles.navigationButton}>
    <Text style={styles.navItemNormalText}>{children}</Text>
  </Link>
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
