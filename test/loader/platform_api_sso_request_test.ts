import { buildRequestParams, makeRequest } from "../../src/loader/platform_api_sso_request"
import { Environment } from "../../src/loader/environment"
import { Type } from "../../src/widget/configuration"

const apiKey = "myapikey"
const clientId = "myclientid"
const userGuid = "USR-777"

describe("buildRequestParams", () => {
  test("all properties are included", () => {
    const params = buildRequestParams(apiKey, clientId, userGuid,
      Environment.INT, Type.ConnectWidget, { mode: "aggregation" })

    expect(params.apiKey).toBe(apiKey)
    expect(params.clientId).toBe(clientId)
    expect(params.userGuid).toBe(userGuid)
    expect(params.environment).toBe("integration")
    expect(params.widgetType).toBe("connect_widget")
    expect(params.options?.mode).toBe("aggregation")
  })

  test("throws error upon missing value", () => {
    expect(() => buildRequestParams("", clientId, userGuid, Environment.INT, Type.ConnectWidget, {})).toThrow()
    expect(() => buildRequestParams(apiKey, "", userGuid, Environment.INT, Type.ConnectWidget, {})).toThrow()
    expect(() => buildRequestParams(apiKey, clientId, "", Environment.INT, Type.ConnectWidget, {})).toThrow()
    expect(() => buildRequestParams(apiKey, clientId, userGuid, "", Type.ConnectWidget, {})).toThrow()
  })

  test("an invalid environment results in an error", () => {
    expect(() => buildRequestParams(apiKey, clientId, userGuid, "badtothebone", Type.ConnectWidget, {})).toThrow()
  })
})

describe("makeRequest", () => {
  test("returns loading configuration", () => {
    const params = buildRequestParams(apiKey, clientId, userGuid,
      Environment.INT, Type.ConnectWidget, {})

    return makeRequest(params).then((res) => {
      expect(res.widget_url.url).toBeDefined()
    })
  })
})
