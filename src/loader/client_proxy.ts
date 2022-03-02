import { Response, RequestError, buildRequestHeaders, buildRequestBody } from "./platform_api"
import { Type } from "../widget/configuration"

export type Request = {
  proxy: string
  options: {
    method: string
    headers: Record<string, string>
    body: string
  }
}

export type RequestParams<Options> = {
  proxy: string
  widgetType: Type
  uiMessageWebviewUrlScheme: string
  options?: Options
}

export function makeRequest(req: Request): Promise<Response> {
  return fetch(req.proxy, req.options)
    .then((response) => {
      if (!response.ok) {
        throw new RequestError(response.status)
      }

      return response
    })
    .then((response) => response.json())
}

export function genRequest<Options>({ proxy, uiMessageWebviewUrlScheme, widgetType, options }: RequestParams<Options>): Request {
  const method = "POST"
  const headers = buildRequestHeaders()
  const body = JSON.stringify(buildRequestBody(widgetType, uiMessageWebviewUrlScheme, options))

  return {
    proxy,
    options: {
      method,
      headers,
      body,
    },
  }
}
