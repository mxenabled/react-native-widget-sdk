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

type ConnectSelectedInstitutionPayload = UserSessionPayload & {
  type: Type.ConnectSelectedInstitution
  code: string
  guid: string
  name: string
  url: string
}

export type Payload
  = LoadPayload
  | ConnectLoadedPayload
  | ConnectSelectedInstitutionPayload
  | ConnectStepChangePayload
