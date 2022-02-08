import { rest } from "msw"
import { setupServer } from "msw/node"

const handlers = [
  rest.post("https://int-api.mx.com/users/:userGuid/widget_urls", (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        widget_url: {
          type: "connect_widget",
          url: "https://int-widgets.moneydesktop.com/md/connect/$ssotoken$",
        }
      })
    ))
]

const server = setupServer(...handlers)

export { rest, server }
