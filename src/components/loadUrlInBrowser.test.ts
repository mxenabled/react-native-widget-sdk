import * as ExpoWebBrowser from "expo-web-browser"
import { loadUrlInBrowser } from "./loadUrlInBrowser"

jest.mock("expo-web-browser", () => {
  return {
    openAuthSessionAsync: jest.fn(),
  }
})

describe("loadUrlInBrowser", () => {
  it("should call openAuthSessionAsync with the provided URL", async () => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(ExpoWebBrowser.openAuthSessionAsync as jest.Mock).mockResolvedValue({ type: "success" })

    const externalUrl = "https://example.com/oauth"
    await loadUrlInBrowser(externalUrl)

    expect(ExpoWebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(externalUrl)
  })

  it("should swallow errors", async () => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(ExpoWebBrowser.openAuthSessionAsync as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    )

    const externalUrl = "https://example.com/oauth"

    expect(ExpoWebBrowser.openAuthSessionAsync).toHaveBeenCalledWith(externalUrl)
    expect(() => loadUrlInBrowser(externalUrl)).not.toThrow()
  })
})
