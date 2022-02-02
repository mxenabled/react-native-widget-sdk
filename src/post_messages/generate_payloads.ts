import { join } from "path"

import {
  genMessageKey,
  merge,
  withEachMessageDefinition,
  write,
} from "./generate_utils"

const template = `
import { Type } from "./generated_types"

{payloadTypes}

export type Payload
  = {payloadUnion}

export function buildPayload(type: Type, metadata: Record<string, string>): Payload {
  switch (type) {
    {buildPayloadCases}

    default:
      throw new Error(\`unknown post message type: \${type}\`)
  }
}
`

const payloadTypeTemplate = `
export type {name}Payload = {
  type: Type.{name}
{fields}
}
`

const buildPayloadCaseTemplate = `
    case Type.{name}:
      return {
        type,
{extractions}
      }
`

const main = () => {
  console.log("Generating payload definitions")

  const payloadTypes: string[] = []
  const payloadTypeNames: string[] = []
  const buildPayloadCases: string[] = []

  withEachMessageDefinition((namespace, action, defn) => {
    const name = genMessageKey(namespace, action)

    const fields = Object.keys(defn).map((key) => `  ${key}: ${defn[key]}`)
    const payloadType = merge(payloadTypeTemplate, {
      name,
      fields: fields.join("\n")
    })

    const extractions = Object.keys(defn).map((key) => `        ${key}: metadata.${key},`)
    const normalizeCase = merge(buildPayloadCaseTemplate, {
      name,
      extractions: extractions.join("\n")
    })

    payloadTypeNames.push(`${name}Payload`)
    payloadTypes.push(payloadType)
    buildPayloadCases.push(normalizeCase)
  })

  const code = merge(template, {
    payloadTypes: payloadTypes.join("\n\n"),
    payloadUnion: payloadTypeNames.join("\n  | "),
    buildPayloadCases: buildPayloadCases.join("\n\n    "),
  })

  const dest = join(__dirname, "generated_payloads.ts")
  write(__filename, dest, code)

  console.log("Done generating payload definitions")
}

main()
