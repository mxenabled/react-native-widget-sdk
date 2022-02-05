import { parse as parseUrl, Url } from "url"

import { Type, typeLookup } from "./generated_types"
import { Payload, buildPayload } from "./generated_payloads"

export class Message {
  protected url: Url

  constructor(protected rawUrl: string) {
    this.url = parseUrl(rawUrl, true)
  }

  isValid() {
    try {
      return this.type() && this.payload()
    } catch (error) {
      return false
    }
  }

  namespace() {
    return (this.url.host || "")
  }

  action() {
    return (this.url.pathname || "").substring(1)
  }

  type(): Type {
    const raw = this.action() ? `mx/${this.namespace()}/${this.action()}` : `mx/${this.namespace()}`
    const value = typeLookup[raw]
    if (value) {
      return value
    }

    throw new Error(`unknown post message type: ${raw}`)
  }

  payload(): Payload {
    let rawMetadata
    if (typeof this.url.query !== "object") {
      throw new Error("unable to parse paylod: invalid request query")
    }

    rawMetadata = this.url.query?.["metadata"]
    if (rawMetadata && typeof rawMetadata !== "string") {
      throw new Error("unable to parse paylod: invalid metadata parameter")
    }

    const metadata = JSON.parse(rawMetadata || "{}")
    return buildPayload(this.type(), metadata)
  }
}
