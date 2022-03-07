import React from "react"
import { render, waitFor } from '@testing-library/react-native';

import { BudgetsWidget } from "../../src/components/MoneyMapWidgets"

describe("BudgetsWidget", () => {
  describe("widget loading", () => {
    test("it is able to load widget when Platform API props are passed in", async () => {
      const component = render(
        <BudgetsWidget
          clientId="myveryownclientid"
          apiKey="myveryownapikey"
          userGuid="USR-777"
          environment="integration"
        />
      )

      const webView = await waitFor(() => component.findByTestId("budgets_widget_webview"))
      expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/budgets/")
    })
  })
})
