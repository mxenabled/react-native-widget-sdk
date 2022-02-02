import base64 from "react-native-base64"

/**
 * interface WidgetRequest {
 *   url: String
 *   options: {
 *     method: String
 *     headers: Object
 *     body: String
 *   }
 * }
 *
 * interface WidgetResponse {
 *   widget_url: {
 *     type: WidgetType
 *     url: String
 *   }
 * }
 *
 * interface WidgetOptions {
 *   color_scheme: "dark" | "light"
 * }
 */
export const WidgetType = {
  ConnectWidget: "connect_widget",
}

export const Environment = {
  INT: "integration",
}

const EnvironmentHost = {
  [Environment.INT]: "https://int-api.mx.com",
}

/**
 * @param {String} userGuid
 * @param {String} clientId
 * @param {String} apiKey
 * @param {Environment} environment
 * @param {WidgetOptions} widgetOptions
 * @return {Promise<WidgetResponse>}
 */
export function makeConnectWidgetRequest(userGuid, clientId, apiKey, environment, widgetOptions) {
  const req = genRequest(userGuid, clientId, apiKey, WidgetType.ConnectWidget, environment, widgetOptions)
  return fetch(req.url, req.options)
    .then((response) => response.json())
}

/**
 * @param {String} userGuid
 * @param {String} clientId
 * @param {String} apiKey
 * @param {WidgetType} widgetType
 * @param {Environment} environment
 * @param {WidgetOptions} widgetOptions
 * @return {Promise<WidgetResponse>}
 */
export function makeRequest(userGuid, clientId, apiKey, widgetType, environment, widgetOptions) {
  const req = genRequest(userGuid, clientId, apiKey, widgetType, environment, widgetOptions)
  return fetch(req.url, req.options)
    .then((response) => response.json())
}

/**
 * @param {String} userGuid
 * @param {String} clientId
 * @param {String} apiKey
 * @param {WidgetType} widgetType
 * @param {Environment} environment
 * @param {WidgetOptions} widgetOptions
 * @return {WidgetRequest}
 */
export function genRequest(userGuid, clientId, apiKey, widgetType, environment, widgetOptions = {}) {
  const url = `${EnvironmentHost[environment]}/users/${userGuid}/widget_urls`
  const method = "POST"

  const authorization = base64.encode(`${clientId}:${apiKey}`)
  const headers = {
    Accept: "application/vnd.mx.api.v1+json",
    Authorization: `Basic ${authorization}`,
    "Content-Type": "application/json",
  }

  const body = JSON.stringify({
    widget_url: {
      widget_type: widgetType,
      is_mobile_webview: true,
      ui_message_version: 4,
      ...widgetOptions,
    },
  })

  return {
    url,
    options: {
      method,
      headers,
      body,
    },
  }
}
