import React, { FC } from "react"
import { render, waitFor } from "@testing-library/react-native"
import { act } from "react-test-renderer"

import { BudgetsWidget, MasterWidget } from "../../src/components/MoneyMapWidgets"
import { PulseWidget, MiniPulseCarouselWidget } from "../../src/components/PulseWidgets"
import { ConnectWidget, ConnectVerificationWidget } from "../../src/components/ConnectWidgets"
import { Props } from "../../src/components/make_component"

import TestingErrorBoundary from "../helpers/TestingErrorBoundary"
import { rest, server } from "../mocks/server"
import { Dimensions, triggerDeviceRotation, triggerUrlChange } from "../mocks/react_native"

describe("BudgetsWidget", () => fullWidgetComponentTestSuite(BudgetsWidget))
describe("ConnectVerificationWidget", () => fullWidgetComponentTestSuite(ConnectVerificationWidget))
describe("MasterWidget", () => fullWidgetComponentTestSuite(MasterWidget))
describe("MiniPulseCarouselWidget", () => fullWidgetComponentTestSuite(MiniPulseCarouselWidget))
describe("PulseWidget", () => fullWidgetComponentTestSuite(PulseWidget))

describe("ConnectWidget", () => {
  fullWidgetComponentTestSuite(ConnectWidget)

  describe("OAuth", () => {
    test("an OAuth deeplink triggers a post message to the web view", async () => {
      expect.assertions(1)

      const component = render(
        <ConnectWidget
          url="https://widgets.moneydesktop.com/md/..."
          sendOAuthPostMessage={(_ref, msg) => {
            expect(msg).toContain("MBR-123")
          }}
        />,
      )

      await waitFor(() => component.findByTestId("widget_webview"))
      triggerUrlChange("appscheme://oauth_complete?member_guid=MBR-123&status=success")
    })

    test("an OAuth success deeplink includes the right status", async () => {
      expect.assertions(1)

      const component = render(
        <ConnectWidget
          url="https://widgets.moneydesktop.com/md/..."
          sendOAuthPostMessage={(_ref, msg) => {
            expect(msg).toContain("oauthComplete/success")
          }}
        />,
      )

      await waitFor(() => component.findByTestId("widget_webview"))
      triggerUrlChange("appscheme://oauth_complete?member_guid=MBR-123&status=success")
    })

    test("an OAuth failure deeplink includes the right status", async () => {
      expect.assertions(1)

      const component = render(
        <ConnectWidget
          url="https://widgets.moneydesktop.com/md/..."
          sendOAuthPostMessage={(_ref, msg) => {
            expect(msg).toContain("oauthComplete/error")
          }}
        />,
      )

      await waitFor(() => component.findByTestId("widget_webview"))
      triggerUrlChange("appscheme://oauth_complete?member_guid=MBR-123&status=error")
    })
  })
})

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
          rest.post("https://api.mx.com/users/:userGuid/widget_urls", (req, res, ctx) =>
            res(ctx.status(500), ctx.json({ message: "NO!" })),
          ),
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
          rest.post("https://client.com/mx-sso-proxy", (req, res, ctx) =>
            res(ctx.status(500), ctx.json({ message: "NO!" })),
          ),
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
