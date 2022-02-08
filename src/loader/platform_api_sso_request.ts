import base64 from "react-native-base64"

import { Environment, Host, lookupEnvironment } from "./environment"
import { Type } from "../widget/widgets"
import { Options } from "../widget/options"

type ExtraOptions<Mode> = Partial<Omit<Options<Mode>, "widget_type">>

export type Request = {
  url: string
  options: {
    method: string
    headers: Record<string, string>
    body: string
  }
}

export type RequestParams<Mode> = {
  apiKey: string
  clientId: string
  userGuid: string
  widgetType: Type
  environment: Environment
  options?: ExtraOptions<Mode>
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

export function buildRequestParams<Mode>(
  apiKey: string,
  clientId: string,
  userGuid: string,
  environment: Environment | string,
  widgetType: Type,
  options: ExtraOptions<Mode>,
): RequestParams<Mode> {
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
    options,
  }
}

export function makeRequest<Mode>(params: RequestParams<Mode>): Promise<Response> {
  const req = genRequest(params)
  return fetch(req.url, req.options)
    .then((response) => response.json())
}

function genRequest<Mode>({ apiKey, clientId, userGuid, widgetType, environment, options }: RequestParams<Mode>): Request {
  const url = `${Host[environment]}/users/${userGuid}/widget_urls`
  const method = "POST"
  const authorization = base64.encode(`${clientId}:${apiKey}`)

  const headers = {
    Accept: "application/vnd.mx.api.v1+json",
    Authorization: `Basic ${authorization}`,
    "Content-Type": "application/json",
  }

  const widgetUrl: Options<Mode> = {
    widget_type: widgetType,
    is_mobile_webview: true,
    ui_message_version: 4,
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
