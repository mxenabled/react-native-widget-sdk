import { Text, View } from "react-native"
import App from "./App"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text>Test</Text>
      <App />
    </View>
  )
}
