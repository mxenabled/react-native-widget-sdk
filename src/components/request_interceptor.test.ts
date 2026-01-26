import {
  AccountCreatedPayload,
  ConnectLoadedPayload,
  ConnectUpdateCredentialsPayload,
  LoadPayload,
  dispatchConnectLocationChangeEvent as handler,
} from "@mxenabled/widget-post-message-definitions"
import { makeRequestInterceptor } from "./request_interceptor"
import * as ExpoWebBrowser from "expo-web-browser"

jest.mock("expo-web-browser", () => {
  return {
    openAuthSessionAsync: jest.fn().mockResolvedValue({ type: "success" }),
  }
})
jest.mock("react-native")

const makeNavigationEvent = (url: string) =>
  ({
    canGoBack: true,
    canGoForward: false,
    loading: false,
    lockIdentifier: 1,
    navigationType: "click",
    title: "Page",
    url,
  } as const)

describe("makeRequestInterceptor", () => {
  test("it returns a navigation event handler", () => {
    const fn = makeRequestInterceptor("https://mx.com/", {
      onIntercept: (url) => handler(url, {}),
    })
    const req = makeNavigationEvent("https://mx.com/page2")

    expect(() => fn(req)).not.toThrow()
  })

  describe("actions", () => {
    test("it bubbles the widget url back up to be loaded in the webview", () => {
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, {}),
      })
      const req = makeNavigationEvent("https://mx.com/")

      expect(fn(req)).toBe(true)
    })

    test("it intercepts other urls", () => {
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, {}),
      })
      const req = makeNavigationEvent("https://mx.com/page2")

      expect(fn(req)).toBe(false)
    })

    test("it intercepts post message urls", () => {
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, {}),
      })
      const req = makeNavigationEvent("mx://connect/loaded")

      expect(fn(req)).toBe(false)
    })

    test("it calls loadUrlInBrowser for external urls", () => {
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, {}),
      })
      const externalUrl = "https://example.com/page"
      const req = makeNavigationEvent(externalUrl)

      fn(req)
      expect(ExpoWebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(externalUrl)
    })
  })

  describe("callbacks", () => {
    test("valid mx/load message calls onLoad callback", () => {
      expect.assertions(1)

      const callbacks = {
        onLoad: (payload: LoadPayload) => expect(payload).toBeDefined(),
      }

      const metadata = encodeURIComponent(JSON.stringify({}))
      const newUrl = `mx://load?metadata=${metadata}`
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      fn(req)
    })

    test("an error thrown from a callback is bubbled back up to the app", () => {
      expect.assertions(1)

      const callbacks = {
        onLoad: (_payload: LoadPayload) => {
          throw new Error(":-(")
        },
      }

      const metadata = encodeURIComponent(JSON.stringify({}))
      const newUrl = `mx://load?metadata=${metadata}`
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      expect(() => fn(req)).toThrow()
    })

    test("valid mx/account/created message calls onAccountCreated callback", () => {
      expect.assertions(1)

      const guid = "ACT-123"
      const callbacks = {
        onAccountCreated: (payload: AccountCreatedPayload) => expect(payload.guid).toBe(guid),
      }

      const metadata = encodeURIComponent(JSON.stringify({ guid }))
      const newUrl = `mx://account/created?metadata=${metadata}`
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      fn(req)
    })

    test("valid mx/connect/loaded message calls onLoaded callback", () => {
      expect.assertions(3)

      const user_guid = "USR-123"
      const session_guid = "777"
      const initial_step = "search"

      const callbacks = {
        onLoaded: (payload: ConnectLoadedPayload) => {
          expect(payload.user_guid).toBe(user_guid)
          expect(payload.session_guid).toBe(session_guid)
          expect(payload.initial_step).toBe(initial_step)
        },
      }

      const metadata = encodeURIComponent(JSON.stringify({ user_guid, session_guid, initial_step }))
      const newUrl = `mx://connect/loaded?metadata=${metadata}`
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      fn(req)
    })

    test("mx/connect/loaded message with missing field value calls onInvalidMessageError", () => {
      expect.assertions(1)

      const user_guid = "USR-123"
      const session_guid = "777"

      const callbacks = {
        onLoaded: (_payload: ConnectLoadedPayload) => expect(false).toBe(true),
        onInvalidMessageError: (url: string, _error: Error) => expect(url).toBe(newUrl),
      }

      const metadata = encodeURIComponent(JSON.stringify({ user_guid, session_guid }))
      const newUrl = `mx://connect/loaded?metadata=${metadata}`
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      fn(req)
    })

    test("an unknown message calls onInvalidMessageError", () => {
      expect.assertions(1)

      const callbacks = {
        onInvalidMessageError: (url: string, _error: Error) => expect(url).toBe(newUrl),
      }

      const newUrl = "mx://connect/notARealMessage?metadata="
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      fn(req)
    })

    test("post message with with nested data", () => {
      expect.assertions(5)

      const user_guid = "USR-123"
      const session_guid = "777"
      const member_guid = "MBR-123"
      const institution = { code: "Z", guid: "INS-123" }

      const callbacks = {
        onUpdateCredentials: (payload: ConnectUpdateCredentialsPayload) => {
          expect(payload.user_guid).toBe(user_guid)
          expect(payload.session_guid).toBe(session_guid)
          expect(payload.member_guid).toBe(member_guid)
          expect(payload.institution.code).toBe(institution.code)
          expect(payload.institution.guid).toBe(institution.guid)
        },
      }

      const metadata = encodeURIComponent(
        JSON.stringify({
          user_guid,
          session_guid,
          member_guid,
          institution,
        }),
      )

      const newUrl = `mx://connect/updateCredentials?metadata=${metadata}`
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      fn(req)
    })

    test("valid message calls onMessage callback in addition to post message callback", () => {
      expect.assertions(2)

      const callbacks = {
        onMessage: (url: string) => expect(url).toBeDefined(),
        onLoad: (payload: LoadPayload) => expect(payload).toBeDefined(),
      }

      const metadata = encodeURIComponent(JSON.stringify({}))
      const newUrl = `mx://load?metadata=${metadata}`
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      fn(req)
    })

    test("invalid message calls onMessage callback in addition to error handler", () => {
      expect.assertions(2)

      const callbacks = {
        onMessage: (url: string) => expect(url).toBeDefined(),
        onInvalidMessageError: (url: string, _error: Error) => expect(url).toBeDefined(),
      }

      const newUrl = "mx://connect/notARealMessage?metadata="
      const fn = makeRequestInterceptor("https://mx.com/", {
        onIntercept: (url) => handler(url, callbacks),
      })
      const req = makeNavigationEvent(newUrl)

      fn(req)
    })
  })
})
