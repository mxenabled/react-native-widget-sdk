import React, { FC } from "react"
import { render, waitFor } from "@testing-library/react-native"
import { act } from "react-test-renderer"

import {
  ConnectWidget as BaseConnectWidget,
  ConnectWidgetProps,
} from "../../src/components/ConnectWidgets"
import { SdkTelemetryProps } from "../../src/components/telemetry"
import { sdkVersion } from "../../src/version"

/* The exported widgets doesn't specify that they adhere to the
 * SdkTelemetryProps type (because we don't want to clutter their prop types)
 * but we _know_ that they do, so we cast ConnectWidget before using it. Since
 * the casting syntax conflicts with JSX, we first put it in a variable and
 * then use that variable in the code.
 */
const TestConnectWidget = BaseConnectWidget as FC<ConnectWidgetProps & SdkTelemetryProps>

describe("SDK telemetry", () => {
  test("a post message with the SDK's information is sent to the webview after the widget fires an mx/load event", async () => {
    expect.assertions(2)

    const component = render(
      <TestConnectWidget
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
        url: `mx://load?metadata=${encodeURIComponent(JSON.stringify({}))}`,
      })
    })
  })
})
