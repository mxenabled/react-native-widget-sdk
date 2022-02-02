import { parse as parseUrl, Url } from "url"

import { Payload } from "./payload"
import { Type, typeMap } from "./type"

export class Parser {
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
    return this.url.host
  }

  action() {
    return (this.url.pathname || "").substring(1)
  }

  type(): Type {
    const raw = this.action() ? `mx/${this.namespace()}/${this.action()}` : `mx/${this.namespace()}`
    const value = typeMap[raw]
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

    switch (this.type()) {
      case Type.Load:
        return {
          type: Type.Load,
        }
      case Type.ConnectLoaded:
        return {
          type: Type.ConnectLoaded,
          user_guid: metadata.user_guid,
          session_guid: metadata.session_guid,
        }
      case Type.ConnectStepChange:
        return {
          type: Type.ConnectStepChange,
          user_guid: metadata.user_guid,
          session_guid: metadata.session_guid,
          previous: metadata.previous,
          current: metadata.current,
        }
      case Type.ConnectSelectedInstitution:
        return {
          type: Type.ConnectSelectedInstitution,
          user_guid: metadata.user_guid,
          session_guid: metadata.session_guid,
          code: metadata.code,
          guid: metadata.guid,
          name: metadata.name,
          url: metadata.url,
        }
    }

    throw new Error("unable to parse paylod: unknown type")
  }
}
