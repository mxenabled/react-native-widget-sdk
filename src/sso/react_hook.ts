import { useEffect, useState } from "react"

import { Props } from "./properties"
import { getSsoUrl } from "./request"

export function useSsoUrl<Options>(props: Props<Options>) {
  const [url, setUrl] = useState<string | void>(undefined)

  useEffect(() => {
    getSsoUrl(props).then(setUrl)
  }, [])

  return url
}
