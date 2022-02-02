import { Type, Payload } from "./"
import { exhaustive } from "../utils/exhaustive"

import {
  ConnectLoadedPayload,
  ConnectSelectedInstitutionPayload,
  ConnectStepChangePayload,
} from "./"

export type ConnectCallback = {
  onLoaded: (payload: ConnectLoadedPayload) => void
  onSelectedInstitution: (payload: ConnectSelectedInstitutionPayload) => void
  onStepChange: (payload: ConnectStepChangePayload) => void
}

export type Callback
  = ConnectCallback

function safeCall<P>(fn: (_: P) => void, payload: P) {
  if (fn) {
    fn(payload)
  }
}

export function dispatchCallback(callbacks: Callback, payload: Payload) {
  switch (payload.type) {
    case Type.Load:
      break

    case Type.ConnectLoaded:
      safeCall(callbacks.onLoaded, payload)
      break

    case Type.ConnectSelectedInstitution:
      safeCall(callbacks.onSelectedInstitution, payload)
      break

    case Type.ConnectStepChange:
      safeCall(callbacks.onStepChange, payload)
      break

    default:
      exhaustive(payload)
  }
}
