/**
 * This file is auto-generated by generate_callbacks.ts, DO NOT EDIT.
 *
 * If you need to make changes to the code in this file, you can do so by
 * modifying definitions.yml.
 */
import { Type } from "./generated_types"
import { Message } from "./message"

import {
  LoadPayload,
  ConnectLoadedPayload,
  ConnectSelectedInstitutionPayload,
  ConnectStepChangePayload,
} from "./generated_payloads"

export type GenericCallback = {
  onLoad?: (payload: LoadPayload) => void
}

export type ConnectCallback = GenericCallback & {
  onLoaded?: (payload: ConnectLoadedPayload) => void
  onSelectedInstitution?: (payload: ConnectSelectedInstitutionPayload) => void
  onStepChange?: (payload: ConnectStepChangePayload) => void
}

const namespaces = {
  generic: [
    "load",
  ],
}

function isGenericMessage(message: Message) {
  return namespaces.generic.includes(message.namespace())
}

function safeCall<P>(payload: P, fn?: (_: P) => void) {
  if (fn) {
    fn(payload)
  }
}

function dispatchGenericCallback(callbacks: GenericCallback, message: Message) {
  const payload = message.payload()

  switch (payload.type) {
    case Type.Load:
      safeCall(payload, callbacks.onLoad)
      break

    default:
      throw new Error(`"unable to dispatch post message with unknown type: ${payload.type}"`)
  }
}

export function dispatchConnectCallback(callbacks: ConnectCallback, message: Message) {
  const payload = message.payload()

  if (isGenericMessage(message)) {
    dispatchGenericCallback(callbacks, message)
    return
  }

  switch (payload.type) {
    case Type.ConnectLoaded:
      safeCall(payload, callbacks.onLoaded)
      break

    case Type.ConnectSelectedInstitution:
      safeCall(payload, callbacks.onSelectedInstitution)
      break

    case Type.ConnectStepChange:
      safeCall(payload, callbacks.onStepChange)
      break

    default:
      throw new Error(`"unable to dispatch post message with unknown type: ${payload.type}"`)
  }
}