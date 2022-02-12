import { Response, RequestError } from "./platform_api"

export function makeRequest(url: string): Promise<Response> {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new RequestError(response.status)
      }

      return response
    })
    .then((response) => response.json())
}
