import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"

type Body = {
  widget_url?: {
    widget_type?: string
  }
}

const handlers = [
  http.post("https://api.mx.com/users/:userGuid/widget_urls", async ({ request }) => {
    const body = (await request.json()) as Body
    const widget = body?.widget_url?.widget_type?.replace("_widget", "")

    if (!widget) {
      return HttpResponse.json({ error: true }, { status: 400 })
    }

    return HttpResponse.json(
      {
        widget_url: {
          type: `${widget}_widget`,
          url: `https://widgets.moneydesktop.com/md/${widget}/$ssotoken$`,
        },
      },
      { status: 200 },
    )
  }),

  http.post("https://client.com/mx-sso-proxy", async ({ request }) => {
    const body = (await request.json()) as Body
    const widget = body?.widget_url?.widget_type?.replace("_widget", "")

    if (!widget) {
      return HttpResponse.json({ error: true }, { status: 400 })
    }

    return HttpResponse.json(
      {
        widget_url: {
          type: `${widget}_widget`,
          url: `https://widgets.moneydesktop.com/md/${widget}/$ssotoken$`,
        },
      },
      { status: 200 },
    )
  }),
]

const server = setupServer(...handlers)

export { http, server }
