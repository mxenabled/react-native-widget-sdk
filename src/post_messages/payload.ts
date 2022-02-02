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

function userSession(metadata: Record<string, string>): UserSessionPayload {
  return {
    user_guid: metadata.user_guid,
    session_guid: metadata.session_guid,
  }
}

export function normalize(type: Type, metadata: Record<string, string>): Payload {
  switch (type) {
    case Type.Load:
      return {
        type,
      }

    case Type.ConnectLoaded:
      return {
        type,
        ...userSession(metadata),
      }

    case Type.ConnectStepChange:
      return {
        type,
        ...userSession(metadata),
        previous: metadata.previous,
        current: metadata.current,
      }

    case Type.ConnectSelectedInstitution:
      return {
        type,
        ...userSession(metadata),
        code: metadata.code,
        guid: metadata.guid,
        name: metadata.name,
        url: metadata.url,
      }

    default:
      throw new Error(`unknown post message type: ${type}`)
  }
}
