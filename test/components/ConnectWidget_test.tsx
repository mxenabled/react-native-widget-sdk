import React from "react"
import { render, waitFor } from '@testing-library/react-native';

import ConnectWidget, { ConnectAggregationWidget, ConnectVerificationWidget } from "../../src/components/ConnectWidget"
import TestingErrorBoundary from "./TestingErrorBoundary"

describe("ConnectWidget", () => {
  describe("widget loading", () => {
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

    describe("missing props", () => {
      test("it throws when no loading props are included", () => {
        const spy = jest.spyOn(console, "error")
        spy.mockImplementation(() => {})

        expect.assertions(1)

        /* [1]: ConnectWidget expects either URL loading props or API
         * loading props but we want to test how it behaves at runtime when
         * it's missing that data, so we suppress compilation errors errors
         * here in order to do that.
         */
        render(
          <TestingErrorBoundary onError={(error) => expect(error).toBeDefined()}>
            {/* @ts-ignore: see [1] for details */}
            <ConnectWidget />
          </TestingErrorBoundary>
        )

        spy.mockClear()
      })
    })
  })

  describe("mode-specific components", () => {
    test(ConnectAggregationWidget.name, () => {
      expect(render(<ConnectAggregationWidget url="https://int-widgets.moneydesktop.com/md/connect/tototoken" />))
    })

    test(ConnectVerificationWidget.name, () => {
      expect(render(<ConnectVerificationWidget url="https://int-widgets.moneydesktop.com/md/connect/tototoken" />))
    })
  })
})
