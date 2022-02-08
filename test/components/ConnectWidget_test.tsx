import React from "react"
import { render, waitFor } from '@testing-library/react-native';

import ConnectWidget from "../../src/components/ConnectWidget"

describe("ConnectWidget", () => {
  test("it is able to load widget when Platform API props are passed in", async () => {
    const component = render(
      <ConnectWidget
        clientId="myveryownclientid"
        apiKey="myveryownapikey"
        userGuid="USR-777"
        environment="integration"
      />
    )

    const webView = await waitFor(() => component.findByTestId("connect-widget-webview"))
    expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/connect/")
  })

  test("it is able to load widget when a URL prop is passed in", async () => {
    const component = render(
      <ConnectWidget
        url="https://int-widgets.moneydesktop.com/md/connect/tototoken"
      />
    )

    const webView = await waitFor(() => component.findByTestId("connect-widget-webview"))
    expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/connect/")
  })
})
