import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Widgets",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="connect"
        options={{
          title: "Connect Widget",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="budgets"
        options={{
          title: "Budgets Widget",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="goals"
        options={{
          title: "Goals Widget",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="pulse"
        options={{
          title: "Pulse Widget",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="spending"
        options={{
          title: "Spending Widget",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="transactions"
        options={{
          title: "Transactions Widget",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  )
}
