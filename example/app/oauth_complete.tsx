import { useEffect } from "react"
import { useLocalSearchParams } from "expo-router"

export default function OAuthComplete() {
  const params = useLocalSearchParams()

  useEffect(() => {
    // Handle the OAuth redirect
    console.log("OAuth redirect received", params)
  }, [params])

  return null
}
