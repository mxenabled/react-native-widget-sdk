import { join } from "path"

import {
  DefinitionType,
  genMessageKey,
  merge,
  withEachMessageDefinition,
  write,
} from "./generate_utils"

const template = `
import { Type } from "./generated_types"

{payloadTypes}

export type GenericPayload
  = {payloadGenericTypesUnion}

export type WidgetPayload
  = {payloadWidgetTypesUnion}

export type Payload
  = GenericPayload
  | WidgetPayload

export function buildPayload(type: Type, metadata: Record<string, string>): Payload {
  switch (type) {
    {buildPayloadCases}

    default:
      throw new Error(\`unknown post message type: \${type}\`)
  }
}
`

const payloadFilledTypeTemplate = `
export type {name}Payload = {
  type: Type.{name}
{fields}
}
`

const payloadEmptyTypeTemplate = `
export type {name}Payload = {
  type: Type.{name}
}
`

const buildFilledPayloadCaseTemplate = `
    case Type.{name}:
      return {
        type,
{extractions}
      }
`

const buildEmptyPayloadCaseTemplate = `
    case Type.{name}:
      return {
        type,
      }
`

const main = () => {
  console.log("Generating payload definitions")

  const payloadTypes: string[] = []
  const payloadAllTypeNames: string[] = []
  const payloadGenericTypeNames: string[] = []
  const payloadWidgetTypeNames: string[] = []
  const buildPayloadCases: string[] = []

  withEachMessageDefinition((namespace, action, defn, defType) => {
    const name = genMessageKey(namespace, action)

    const fields = Object.keys(defn).map((key) => `  ${key}: ${defn[key]}`)
    const payloadTypeTemplate = fields.length > 0 ? payloadFilledTypeTemplate : payloadEmptyTypeTemplate
    const payloadType = merge(payloadTypeTemplate, {
      name,
      fields: fields.join("\n")
    })

    const extractions = Object.keys(defn).map((key) => `        ${key}: metadata.${key},`)
    const buildPayloadCaseTemplate = extractions.length > 0 ? buildFilledPayloadCaseTemplate : buildEmptyPayloadCaseTemplate
    const normalizeCase = merge(buildPayloadCaseTemplate, {
      name,
      extractions: extractions.join("\n")
    })

    switch (defType) {
      case DefinitionType.Generic:
        payloadGenericTypeNames.push(`${name}Payload`)
        break

      case DefinitionType.Widget:
        payloadWidgetTypeNames.push(`${name}Payload`)
        break

      case DefinitionType.Entity:
        break
    }

    payloadAllTypeNames.push(`${name}Payload`)
    payloadTypes.push(payloadType)
    buildPayloadCases.push(normalizeCase)
  })

  const code = merge(template, {
    payloadTypes: payloadTypes.join("\n\n"),
    payloadAllTypesUnion: payloadAllTypeNames.join("\n  | "),
    payloadGenericTypesUnion: payloadGenericTypeNames.join("\n  | "),
    payloadWidgetTypesUnion: payloadWidgetTypeNames.join("\n  | "),
    buildPayloadCases: buildPayloadCases.join("\n\n    "),
  })

  const dest = join(__dirname, "generated_payloads.ts")
  write(__filename, dest, code)

  console.log("Done generating payload definitions")
}

main()
