import React from "react"
import { render, waitFor } from '@testing-library/react-native';

import ConnectWidget from "../../src/components/ConnectWidget"

const okProps = {
  clientId: "myveryownclientid",
  apiKey: "myveryownapikey",
  userGuid: "USR-777",
  environment: "integration",
}

describe("ConnectWidget", () => {
  test("loads widget SSO url", async () => {
    const component = render(<ConnectWidget {...okProps} />)
    const webView = await waitFor(() => component.findByTestId("connect-widget-webview"))
    expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/connect/")
  })
})
