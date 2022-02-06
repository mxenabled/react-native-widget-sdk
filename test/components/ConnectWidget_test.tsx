import React from "react"
import { WebView } from "react-native-webview"
import { create } from "react-test-renderer"

import ConnectWidget from "../../src/components/ConnectWidget"

import { waitFor } from "./component_helper"

const okProps = {
  clientId: "myveryownclientid",
  apiKey: "myveryownapikey",
  userGuid: "USR-777",
  environment: "integration",
}

describe("ConnectWidget", () => {
  test("loads widget SSO url", async () => {
    const component = create(<ConnectWidget {...okProps} />)
    const webView = await waitFor(async () => await component.root.findByType(WebView))
    expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/connect/")
  })
})
