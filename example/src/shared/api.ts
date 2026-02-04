import { Platform } from "react-native"

const baseUrl = Platform.OS === "android" ? "http://10.0.2.2:8089" : "http://localhost:8089"
const proxyUrl = `${baseUrl}/user/widget_urls`

interface WidgetUrlResponse {
  widget_url: {
    url: string
  }
}

export const fetchConnectWidgetUrl = async (clientRedirectUrl: string) => {
  const headers: Record<string, string> = {
    "Accept-Version": "v20250224",
    "Content-Type": "application/json",
  }

  const method = "POST"
  const body = JSON.stringify({
    widget_url: {
      client_redirect_url: clientRedirectUrl,
      is_mobile_webview: true,
      ui_message_version: 4,
      widget_type: "connect_widget",
      data_request: { products: ["identity_verification"] },
    },
  })

  try {
    const response = await fetch(proxyUrl, {
      body,
      headers,
      method,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch widget URL: ${response.status} ${response.statusText}`)
    }

    const data: WidgetUrlResponse = await response.json()

    return data.widget_url.url
  } catch (error) {
    console.error("Error fetching widget URL:", error)
    throw error
  }
}
