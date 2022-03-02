import base64 from "react-native-base64"

import { Environment, Host, lookupEnvironment } from "./environment"
import { Type } from "../widget/configuration"

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

export type RequestHeaderOptions = {
  authorization?: string
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

export function buildRequestHeaders({ authorization }: RequestHeaderOptions = {}) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.mx.api.v1+json",
    "Content-Type": "application/json",
  }

  if (authorization) {
    headers["Authorization"] = `Basic ${authorization}`
  }

  return headers
}

export function buildRequestBody<Options>(
  widgetType: Type,
  uiMessageWebviewUrlScheme: string,
  options: Options,
) {
  return {
    widget_url: {
      widget_type: widgetType,
      is_mobile_webview: true,
      ui_message_version: 4,
      ui_message_webview_url_scheme: uiMessageWebviewUrlScheme,
      ...options,
    }
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

  const headers = buildRequestHeaders({ authorization })
  const body = JSON.stringify(buildRequestBody(widgetType, uiMessageWebviewUrlScheme, options))

  return {
    url,
    options: {
      method,
      headers,
      body,
    },
  }
}
