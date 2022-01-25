import React, { useEffect, useState } from "react"

import { View } from "react-native"
import { WebView } from "react-native-webview"

import { makeConnectWidgetRequest } from "./WidgetUrls"

/**
 * interface ConnectWidgetProps {
 *   clientId: String
 *   apiKey: String
 *   userGuid: String
 *   environment: Environment
 *   onLoadComplete?: () => void
 *   onLoadError?: (Error) => void
 * }
 */
export default function ConnectWidget({
  clientId,
  apiKey,
  userGuid,
  environment,
  onLoadComplete = () => {},
  onLoadError = (error) => {},
}) {
  const [url, setUrl] = useState(null)

  const viewStyle = {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  }

  useEffect(() => {
    makeConnectWidgetRequest(userGuid, clientId, apiKey, environment)
      .then((response) => setUrl(response.widget_url.url))
      .then(() => onLoadComplete())
      .catch((error) => onLoadError(error))
  }, [])

  if (!url) {
    return <View style={viewStyle} />
  }

  return (
    <View style={viewStyle}>
      <WebView source={{ uri: url }} />
    </View>
  )
}
