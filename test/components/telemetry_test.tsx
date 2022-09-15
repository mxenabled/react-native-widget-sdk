import React from "react"
import { render, waitFor } from "@testing-library/react-native"
import { act } from "react-test-renderer"

import { ConnectWidget } from "../../src/components/ConnectWidgets"
import { sdkVersion } from "../../src/version"

describe("SDK telemetry", () => {
  test("a post message with the SDK's information is sent to the webview after the widget fires an mx/load event", async () => {
    expect.assertions(2)

    const component = render(
      <ConnectWidget
        url="https://widgets.moneydesktop.com/md/..."
        sendSdkInfoPostMessage={(_ref, msg) => {
          const event = JSON.parse(msg)
          expect(event.type).toBe("mx/sdk/info")
          expect(event.metadata.version).toBe(sdkVersion)
        }}
      />,
    )

    await waitFor(() => component.findByTestId("widget_webview"))
    await act(async () => {
      const webView = await component.findByTestId("widget_webview")
      const { onShouldStartLoadWithRequest } = webView.props

      onShouldStartLoadWithRequest({
        nativeEvent: {
          url: `mx://load?metadata=${encodeURIComponent(JSON.stringify({}))}`,
        },
      })
    })
  })
})
