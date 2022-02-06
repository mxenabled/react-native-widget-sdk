import { buildSsoRequestParams, makeRequest } from "../../src/loader/sso_request"
import { Environment } from "../../src/loader/environment"
import { Type } from "../../src/widget/widgets"

import { runSsoServer } from "../mocks/sso_api_server"

runSsoServer()

const apiKey = "myapikey"
const clientId = "myclientid"
const userGuid = "USR-777"

describe("buildSsoRequestParams", () => {
  test("all properties are included", () => {
    const params = buildSsoRequestParams(apiKey, clientId, userGuid,
      Environment.INT, Type.ConnectWidget, { mode: "aggregation" })

    expect(params.apiKey).toBe(apiKey)
    expect(params.clientId).toBe(clientId)
    expect(params.userGuid).toBe(userGuid)
    expect(params.environment).toBe("integration")
    expect(params.widgetType).toBe("connect_widget")
    expect(params.options?.mode).toBe("aggregation")
  })

  test("throws error upon missing value", () => {
    expect(() => buildSsoRequestParams("", clientId, userGuid, Environment.INT, Type.ConnectWidget, {})).toThrow()
    expect(() => buildSsoRequestParams(apiKey, "", userGuid, Environment.INT, Type.ConnectWidget, {})).toThrow()
    expect(() => buildSsoRequestParams(apiKey, clientId, "", Environment.INT, Type.ConnectWidget, {})).toThrow()
    expect(() => buildSsoRequestParams(apiKey, clientId, userGuid, "", Type.ConnectWidget, {})).toThrow()
  })

  test("an invalid environment results in an error", () => {
    expect(() => buildSsoRequestParams(apiKey, clientId, userGuid, "badtothebone", Type.ConnectWidget, {})).toThrow()
  })
})

describe("makeRequest", () => {
  test("returns loading configuration", () => {
    const params = buildSsoRequestParams(apiKey, clientId, userGuid,
      Environment.INT, Type.ConnectWidget, {})

    return makeRequest(params).then((res) => {
      expect(res.widget_url.url).toBeDefined()
    })
  })
})
