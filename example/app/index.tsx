import React, { FC, PropsWithChildren } from "react"
import { SafeAreaView, Text, View, StyleSheet } from "react-native"
import { Link } from "expo-router"

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
  navigation: {
    display: "flex",
    height: "100%",
    gap: 10,
    margin: 50,
  },
  navigationButton: {
    alignItems: "center",
    backgroundColor: "rgb(144, 202, 249)",
    padding: 20,
  },
  navItemNormalText: {
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 20,
  },
})

export default function Home() {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.navigation}>
        <NavigationButton href="/connect">Connect</NavigationButton>
        <NavigationButton href="/budgets">Budgets</NavigationButton>
        <NavigationButton href="/goals">Goals</NavigationButton>
        <NavigationButton href="/pulse">Pulse</NavigationButton>
        <NavigationButton href="/spending">Spending</NavigationButton>
        <NavigationButton href="/transactions">Transactions</NavigationButton>
      </View>
    </SafeAreaView>
  )
}

const NavigationButton: FC<PropsWithChildren<{ href: string }>> = ({ href, children }) => (
  <Link href={href} style={styles.navigationButton} asChild>
    <Text style={styles.navItemNormalText}>{children}</Text>
  </Link>
)
