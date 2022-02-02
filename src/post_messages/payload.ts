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

export function normalize(typ: Type, metadata: Record<string, string>): Payload {
  switch (typ) {
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

    default:
      throw new Error(`unknown post message type: ${typ}`)
  }
}
