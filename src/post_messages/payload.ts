import { Type } from "./type"

type UserSessionPayload = {
  user_guid: string
  session_guid: string
}

type LoadPayload = {
  type: Type.Load
}

type ConnectLoadedPayload = UserSessionPayload & {
  type: Type.ConnectLoaded
}

type ConnectStepChangePayload = UserSessionPayload & {
  type: Type.ConnectStepChange
  previous: string
  current: string
}

export type Payload
  = LoadPayload
  | ConnectLoadedPayload
  | ConnectStepChangePayload
