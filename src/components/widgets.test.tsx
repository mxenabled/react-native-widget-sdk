import React, { FC } from "react"
import { render, waitFor } from "@testing-library/react-native"
import { act } from "react-test-renderer"

import { BudgetsWidget, MasterWidget } from "./MoneyMapWidgets"
import { PulseWidget, MiniPulseCarouselWidget } from "./PulseWidgets"
import { Props } from "./make_component"

import TestingErrorBoundary from "../../test/helpers/TestingErrorBoundary"
import { http, server } from "../../test/mocks/server"
import { Dimensions, triggerDeviceRotation } from "../../test/mocks/react_native"

jest.mock("expo-web-browser", () => {
  return {
    openAuthSessionAsync: jest.fn().mockResolvedValue({ type: "success" }),
  }
})

describe("BudgetsWidget", () => fullWidgetComponentTestSuite(BudgetsWidget))
describe("MasterWidget", () => fullWidgetComponentTestSuite(MasterWidget))
describe("MiniPulseCarouselWidget", () => fullWidgetComponentTestSuite(MiniPulseCarouselWidget))
describe("PulseWidget", () => fullWidgetComponentTestSuite(PulseWidget))

export function fullWidgetComponentTestSuite(Component: FC<Props>) {
  testSsoUrlLoading(Component)
  testStyling(Component)
}

function testSsoUrlLoading(Component: FC<Props>) {
  describe("SSO URL Loading", () => {
    describe("Platform API", () => {
      test("it is able to load the widget url when Platform API props are passed in", async () => {
        const component = render(
          <Component
            clientId="myVeryOwnClientId"
            apiKey="myVeryOwnApiKey"
            userGuid="USR-777"
            environment="production"
          />,
        )

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain("https://widgets.moneydesktop.com/md/")
      })

      test("an error results in the onSsoUrlLoadError callback being triggered", async () => {
        let called = false

        server.use(
          http.post("https://api.mx.com/users/:userGuid/widget_urls", () => {
            return new Response(JSON.stringify({ message: "NO!" }), { status: 500 })
          }),
        )

        render(
          <Component
            clientId="myVeryOwnClientId"
            apiKey="myVeryOwnApiKey"
            userGuid="USR-777"
            environment="production"
            onSsoUrlLoadError={(_error) => {
              called = true
            }}
          />,
        )

        await waitFor(() => {
          if (!called) throw new Error()
        })
        expect(called).toBe(true)
      })

      test("it passes the request back to the host before execution via the ssoRequestPreprocess callback", async () => {
        const component = render(
          <Component
            clientId="myVeryOwnClientId"
            apiKey="myVeryOwnApiKey"
            userGuid="USR-777"
            environment="production"
            ssoRequestPreprocess={(req) => {
              const body = JSON.parse(req.options.body?.toString() || "")
              body.widget_url.widget_type = "something_else"
              req.options.body = JSON.stringify(body)
              return req
            }}
          />,
        )

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain(
          "https://widgets.moneydesktop.com/md/something_else/",
        )
      })
    })

    describe("Proxy server", () => {
      test("it is able to load the widget url when proxy props are passed in", async () => {
        const component = render(<Component proxy="https://client.com/mx-sso-proxy" />)

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain("https://widgets.moneydesktop.com/md/")
      })

      test("an error results in the onSsoUrlLoadError callback being triggered", async () => {
        let called = false

        server.use(
          http.post("https://client.com/mx-sso-proxy", () => {
            return new Response(JSON.stringify({ message: "NO!" }), { status: 500 })
          }),
        )

        render(
          <Component
            proxy="https://client.com/mx-sso-proxy"
            onSsoUrlLoadError={(_error) => {
              called = true
            }}
          />,
        )

        await waitFor(() => {
          if (!called) throw new Error()
        })
        expect(called).toBe(true)
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
          />,
        )

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain(
          "https://widgets.moneydesktop.com/md/something_else/",
        )
      })
    })

    describe("URL", () => {
      test("it is able to get the widget url from props when a url prop is passed in", async () => {
        const component = render(
          <Component url="https://widgets.moneydesktop.com/md/hi/tototoken" />,
        )

        const webView = await waitFor(() => component.findByTestId("widget_webview"))
        expect(webView.props.source.uri).toContain(
          "https://widgets.moneydesktop.com/md/hi/tototoken",
        )
      })
    })

    test("it throws when no loading props are included", () => {
      const spy = jest.spyOn(console, "error")
      spy.mockImplementation(() => {
        /* do nothing */
      })

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
        </TestingErrorBoundary>,
      )

      spy.mockClear()
    })
  })
}

function testStyling(Component: FC<Props>) {
  describe("Styling", () => {
    describe("default styles", () => {
      test("height and width match the device's screen dimensions", async () => {
        const { width, height } = Dimensions.get("screen")

        const component = render(<Component url="https://widgets.moneydesktop.com/..." />)
        const view = await waitFor(() => component.findByTestId("widget_view"))

        expect(view.props.style.width).toBe(width)
        expect(view.props.style.height).toBe(height)
      })

      test("screen orientation changes result in the view being resized", async () => {
        const { width, height } = Dimensions.get("screen")

        const component = render(<Component url="https://widgets.moneydesktop.com/..." />)
        const view = await waitFor(() => component.findByTestId("widget_view"))

        await act(() => triggerDeviceRotation())

        expect(view.props.style.width).toBe(height)
        expect(view.props.style.height).toBe(width)
      })
    })
  })
}
