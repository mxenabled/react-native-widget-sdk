import React from "react"
import { render, waitFor } from '@testing-library/react-native';

import { PulseWidget } from "../../src/components/PulseWidget"

describe("PulseWidget", () => {
  describe("widget loading", () => {
    test("it is able to load widget when Platform API props are passed in", async () => {
      const component = render(
        <PulseWidget
          clientId="myveryownclientid"
          apiKey="myveryownapikey"
          userGuid="USR-777"
          environment="integration"
        />
      )

      const webView = await waitFor(() => component.findByTestId("pulse_widget_webview"))
      expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/pulse/")
    })
  })
})
