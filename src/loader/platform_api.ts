import base64 from "react-native-base64"

import { Environment, Host, lookupEnvironment } from "./environment"
import { Type, InternalWidgetOptions } from "../widget/configuration"

export class RequestError extends Error {
  readonly statusCode: number

  constructor(statusCode: number) {
    super(`Request failed: ${statusCode}`)
    this.statusCode = statusCode
    Object.setPrototypeOf(this, RequestError.prototype)
  }
}

export type Request = {
  url: string
  options: {
    method: string
    headers: Record<string, string>
    body: string
  }
}

export type RequestParams<Options> = {
  apiKey: string
  clientId: string
  userGuid: string
  widgetType: Type
  uiMessageWebviewUrlScheme: string
  environment: Environment
  options?: Options
}

export type Response = {
  widget_url: {
    type: Type
    url: string
  }
}

function assert(name: string, value: string) {
  if (!value) {
    throw new Error(`Unable to make SSO request to Platform API: '${name}' is required but is missing`)
  }
}

export function buildRequestParams<Options>(
  apiKey: string,
  clientId: string,
  userGuid: string,
  environment: Environment | string,
  widgetType: Type,
  uiMessageWebviewUrlScheme: string,
  options: Options,
): RequestParams<Options> {
  assert("apiKey", apiKey)
  assert("clientId", clientId)
  assert("userGuid", userGuid)
  assert("environment", environment)

  return {
    userGuid,
    clientId,
    apiKey,
    environment: lookupEnvironment(environment),
    widgetType,
    uiMessageWebviewUrlScheme,
    options,
  }
}

export function makeRequest<Options>(params: RequestParams<Options>): Promise<Response> {
  const req = genRequest(params)
  return fetch(req.url, req.options)
    .then((response) => {
      if (!response.ok) {
        throw new RequestError(response.status)
      }

      return response
    })
    .then((response) => response.json())
}

function genRequest<Options>({ apiKey, clientId, userGuid, widgetType, uiMessageWebviewUrlScheme, environment, options }: RequestParams<Options>): Request {
  const url = `${Host[environment]}/users/${userGuid}/widget_urls`
  const method = "POST"
  const authorization = base64.encode(`${clientId}:${apiKey}`)

  const headers = {
    Accept: "application/vnd.mx.api.v1+json",
    Authorization: `Basic ${authorization}`,
    "Content-Type": "application/json",
  }

  const widgetUrl: InternalWidgetOptions = {
    widget_type: widgetType,
    is_mobile_webview: true,
    ui_message_version: 4,
    ui_message_webview_url_scheme: uiMessageWebviewUrlScheme,
    ...options,
  }

  const body = JSON.stringify({
    widget_url: widgetUrl,
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
