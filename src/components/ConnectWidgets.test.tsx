import { render, waitFor } from "@testing-library/react-native"
import { ConnectWidget } from "./ConnectWidgets"
import { fullWidgetComponentTestSuite } from "./widgets.test"
import { triggerUrlChange } from "../../test/mocks/react_native"

jest.mock("expo-web-browser", () => {
  return {
    openAuthSessionAsync: jest.fn().mockResolvedValue({ type: "success" }),
  }
})

describe("ConnectWidget", () => {
  fullWidgetComponentTestSuite(ConnectWidget)

  describe("OAuth", () => {
    const testCases: {
      label: string
      url: string
      check: (msg: string) => void
    }[] = [
      {
        label:
          "an OAuth deeplink triggers a post message to the web view (public URL with matching host)",
        url: "appscheme://oauth_complete?member_guid=MBR-123&status=success",
        check: (msg) => expect(msg).toContain("MBR-123"),
      },
      {
        label:
          "an OAuth deeplink triggers a post message to the web view (local URL with matching path)",
        url: "exp://127.0.0.1:19000/--/oauth_complete?member_guid=MBR-123&status=success",
        check: (msg) => expect(msg).toContain("MBR-123"),
      },
      {
        label:
          "an OAuth deeplink triggers a post message to the web view (public URL with matching path)",
        url: "exp://exp.host/@community/with-webbrowser-redirect/--/oauth_complete?member_guid=MBR-123&status=success",
        check: (msg) => expect(msg).toContain("MBR-123"),
      },
      {
        label:
          "an OAuth success deeplink includes the right status (public URL with matching host)",
        url: "appscheme://oauth_complete?member_guid=MBR-123&status=success",
        check: (msg) => expect(msg).toContain("oauthComplete/success"),
      },
      {
        label: "an OAuth success deeplink includes the right status (local URL with matching path)",
        url: "exp://127.0.0.1:19000/--/oauth_complete?member_guid=MBR-123&status=success",
        check: (msg) => expect(msg).toContain("oauthComplete/success"),
      },
      {
        label:
          "an OAuth success deeplink includes the right status (public URL with matching path)",
        url: "exp://exp.host/@community/with-webbrowser-redirect/--/oauth_complete?member_guid=MBR-123&status=success",
        check: (msg) => expect(msg).toContain("oauthComplete/success"),
      },
      {
        label:
          "an OAuth failure deeplink includes the right status (public URL with matching host)",
        url: "appscheme://oauth_complete?member_guid=MBR-123&status=error",
        check: (msg) => expect(msg).toContain("oauthComplete/error"),
      },
      {
        label: "an OAuth failure deeplink includes the right status (local URL with matching path)",
        url: "exp://127.0.0.1:19000/--/oauth_complete?member_guid=MBR-123&status=error",
        check: (msg) => expect(msg).toContain("oauthComplete/error"),
      },
      {
        label:
          "an OAuth failure deeplink includes the right status (public URL with matching path)",
        url: "exp://exp.host/@community/with-webbrowser-redirect/--/oauth_complete?member_guid=MBR-123&status=error",
        check: (msg) => expect(msg).toContain("oauthComplete/error"),
      },
    ]

    testCases.forEach((testCase) => {
      test(testCase.label, async () => {
        expect.assertions(1)

        const component = render(
          <ConnectWidget
            url="https://widgets.moneydesktop.com/md/..."
            sendOAuthPostMessage={(_ref, msg) => {
              testCase.check(msg)
            }}
          />,
        )

        await waitFor(() => component.findByTestId("widget_webview"))
        triggerUrlChange(testCase.url)
      })
    })
  })
})
