import React from "react"
import { render, waitFor } from "@testing-library/react-native"
import { act } from "react-test-renderer"

import { ConnectWidget, ConnectAggregationWidget, ConnectVerificationWidget } from "../../src/components/ConnectWidgets"
import TestingErrorBoundary from "../helpers/TestingErrorBoundary"

import { rest, server } from "../mocks/server"
import { Dimensions, rotateOrientation } from "../mocks/react_native"

describe("ConnectWidget", () => {
  describe("widget loading", () => {
    describe("Platform API", () => {
      test("it is able to load widget when Platform API props are passed in", async () => {
        const component = render(
          <ConnectWidget
            clientId="myveryownclientid"
            apiKey="myveryownapikey"
            userGuid="USR-777"
            environment="integration"
          />
        )

        const webView = await waitFor(() => component.findByTestId("connect_widget_webview"))
        expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/connect/")
      })

      test("an error from the Platform API results in the onSsoError callback being triggered", async () => {
        let onSsoErrorCalled = false

        server.use(
          rest.post("https://int-api.mx.com/users/:userGuid/widget_urls", (req, res, ctx) =>
            res(ctx.status(500), ctx.json({ message: "NO!" }))))

        render(
          <ConnectWidget
            clientId="myveryownclientid"
            apiKey="myveryownapikey"
            userGuid="USR-777"
            environment="integration"
            onSsoError={(_error) => { onSsoErrorCalled = true }}
          />
        )

        await waitFor(() => { if (!onSsoErrorCalled) throw new Error })
        expect(onSsoErrorCalled).toBe(true)
      })
    })

    describe("Proxy server", () => {
      test("it is able to load widget when proxy props are passed in", async () => {
        const component = render(
          <ConnectWidget
            proxy="https://client.com/mx-sso-proxy"
          />
        )

        const webView = await waitFor(() => component.findByTestId("connect_widget_webview"))
        expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/connect/")
      })

      test("it passes the request back to the host before execution", async () => {
        const component = render(
          <ConnectWidget
            proxy="https://client.com/mx-sso-proxy"
            buildProxyRequest={(req) => {
              const body = JSON.parse(req.options.body)
              body.widget_url.widget_type = "something_else"
              req.options.body = JSON.stringify(body)
              return req
            }}
          />
        )

        const webView = await waitFor(() => component.findByTestId("connect_widget_webview"))
        expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/something_else/")
      })
    })

    describe("Widget URL", () => {
      test("it is able to load widget when a URL prop is passed in", async () => {
        const component = render(
          <ConnectWidget
            url="https://int-widgets.moneydesktop.com/md/connect/tototoken"
          />
        )

        const webView = await waitFor(() => component.findByTestId("connect_widget_webview"))
        expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/connect/")
      })
    })

    describe("missing props", () => {
      test("it throws when no loading props are included", () => {
        const spy = jest.spyOn(console, "error")
        spy.mockImplementation(() => { /* do nothing */ })

        expect.assertions(1)

        /* [1]: ConnectWidget expects either URL loading props or API
         * loading props but we want to test how it behaves at runtime when
         * it's missing that data, so we suppress compilation errors errors
         * here in order to do that.
         */
        render(
          <TestingErrorBoundary onError={(error) => expect(error).toBeDefined()}>
            {/* eslint @typescript-eslint/ban-ts-comment: "off" */}
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

  describe("dimensions", () => {
    test("height and width match the device's screen dimensions", async () => {
      const { width, height } = Dimensions.get("screen")

      const component = render(<ConnectWidget url="https://int-widgets.moneydesktop.com/md/connect/tototoken" />)
      const view = await waitFor(() => component.findByTestId("connect_widget_view"))

      expect(view.props.style.width).toBe(width)
      expect(view.props.style.height).toBe(height)
    })

    test("screen orientation changes result in the view being resized", async () => {
      const { width, height } = Dimensions.get("screen")

      const component = render(<ConnectWidget url="https://int-widgets.moneydesktop.com/md/connect/tototoken" />)
      const view = await waitFor(() => component.findByTestId("connect_widget_view"))

      await act(() => rotateOrientation())

      expect(view.props.style.width).toBe(height)
      expect(view.props.style.height).toBe(width)
    })
  })
})
