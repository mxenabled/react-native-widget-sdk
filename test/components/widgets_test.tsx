import React, { FC } from "react"
import { render, waitFor } from "@testing-library/react-native"
import { act } from "react-test-renderer"

import { Props } from "../../src/components/make_component"

import TestingErrorBoundary from "../helpers/TestingErrorBoundary"
import { rest, server } from "../mocks/server"
import { Dimensions, rotateOrientation } from "../mocks/react_native"

import { BudgetsWidget, MasterWidget } from "../../src/components/MoneyMapWidgets"
import { PulseWidget, MiniPulseCarouselWidget } from "../../src/components/PulseWidgets"
import { ConnectWidget, ConnectVerificationWidget } from "../../src/components/ConnectWidgets"

describe("BudgetsWidget", () => fullWidgetComponentTestSuite(BudgetsWidget))
describe("ConnectVerificationWidget", () => fullWidgetComponentTestSuite(ConnectVerificationWidget))
describe("ConnectWidget", () => fullWidgetComponentTestSuite(ConnectWidget))
describe("MasterWidget", () => fullWidgetComponentTestSuite(MasterWidget))
describe("MiniPulseCarouselWidget", () => fullWidgetComponentTestSuite(MiniPulseCarouselWidget))
describe("PulseWidget", () => fullWidgetComponentTestSuite(PulseWidget))

function fullWidgetComponentTestSuite(Component: FC<Props>) {
  testSsoUrlLoading(Component)
  testStyling(Component)
}

function testSsoUrlLoading(Component: FC<Props>) {
  describe("SSO URL Loading", () => {
    describe("Platform API", () => {
      test("it is able to load the widget url when Platform API props are passed in", async () => {
        const component = render(
          <Component
            clientId="myveryownclientid"
            apiKey="myveryownapikey"
            userGuid="USR-777"
            environment="integration"
          />
        )

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/")
      })

      test("an error results in the onSsoUrlLoadError callback being triggered", async () => {
        let called = false

        server.use(
          rest.post("https://int-api.mx.com/users/:userGuid/widget_urls", (req, res, ctx) =>
            res(ctx.status(500), ctx.json({ message: "NO!" }))))

        render(
          <Component
            clientId="myveryownclientid"
            apiKey="myveryownapikey"
            userGuid="USR-777"
            environment="integration"
            onSsoUrlLoadError={(_error) => { called = true }}
          />
        )

        await waitFor(() => { if (!called) throw new Error })
        expect(called).toBe(true)
      })
    })

    describe("Proxy server", () => {
      test("it is able to load the widget url when proxy props are passed in", async () => {
        const component = render(
          <Component
            proxy="https://client.com/mx-sso-proxy"
          />
        )

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/")
      })

      test("it passes the request back to the host before execution via the ssoRequestPreprocess callback", async () => {
        const component = render(
          <Component
            proxy="https://client.com/mx-sso-proxy"
            ssoRequestPreprocess={(req) => {
              const body = JSON.parse(req.options.body?.toString() || "")
              body.widget_url.widget_type = "something_else"
              req.options.body = JSON.stringify(body)
              return req
            }}
          />
        )

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/something_else/")
      })
    })

    describe("URL", () => {
      test("it is able to get the widget url from props when a url prop is passed in", async () => {
        const component = render(
          <Component
            url="https://int-widgets.moneydesktop.com/md/hi/tototoken"
          />
        )

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain("https://int-widgets.moneydesktop.com/md/hi/tototoken")
      })
    })

    test("it throws when no loading props are included", () => {
      const spy = jest.spyOn(console, "error")
      spy.mockImplementation(() => { /* do nothing */ })

      expect.assertions(1)

      /* [1]: Widget components expect either URL loading props, API loading
       * props, or proxy loading props, but we want to test how it behaves at
       * runtime when it's missing that data, so we suppress compilation errors
       * errors here in order to do that.
       */
      render(
        <TestingErrorBoundary onError={(error) => expect(error).toBeDefined()}>
          {/* eslint @typescript-eslint/ban-ts-comment: "off" */}
          {/* @ts-ignore: see [1] for details */}
          <Component />
        </TestingErrorBoundary>
      )

      spy.mockClear()
    })
  })
}

function testStyling(Component: FC<Props>) {
  describe("Styling", () => {
    test("height and width match the device's screen dimensions by default", async () => {
      const { width, height } = Dimensions.get("screen")

      const component = render(<Component url="https://int-widgets.moneydesktop.com/..." />)
      const view = await waitFor(() => component.findByTestId("widget_view"))

      expect(view.props.style.width).toBe(width)
      expect(view.props.style.height).toBe(height)
    })

    test("screen orientation changes result in the view being resized", async () => {
      const { width, height } = Dimensions.get("screen")

      const component = render(<Component url="https://int-widgets.moneydesktop.com/..." />)
      const view = await waitFor(() => component.findByTestId("widget_view"))

      await act(() => rotateOrientation())

      expect(view.props.style.width).toBe(height)
      expect(view.props.style.height).toBe(width)
    })
  })
}
