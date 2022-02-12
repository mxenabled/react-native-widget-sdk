/* istanbul ignore file */

import { join } from "path"

import {
  DefinitionType,
  FieldType,
  genMessageKey,
  genMessageType,
  merge,
  withEachMessageDefinition,
  write,
} from "./generate_utils"

const template = `
import { Type } from "./generated_types"

// This is an internal error. Throw when we are decoding a post message's
// metadata and we encourntered a missing field or an invalid value. This
// likely means there has been a change to the definition of a post message
// that we do not know about.
export class PostMessageFieldDecodeError extends Error {
  public messageType: string
  public field: string
  public expectedType: TypeDef
  public gotValue: unknown

  constructor(messageType: string, field: string, expectedType: TypeDef, gotValue: unknown) {
    super(\`Unable to decode '\${field}' from '\${messageType}'\`)

    this.messageType = messageType
    this.field = field
    this.expectedType = expectedType
    this.gotValue = gotValue

    Object.setPrototypeOf(this, PostMessageFieldDecodeError.prototype);
  }
}

{payloadTypes}

export type GenericPayload =
{payloadGenericTypesUnion}

export type EntityPayload =
{payloadEntityTypesUnion}

export type WidgetPayload =
{payloadWidgetTypesUnion}

export type Payload =
  | GenericPayload
  | EntityPayload
  | WidgetPayload

type Value = string | number
type NestedValue = Record<string, Value>
type Metadata = Record<string, Value | NestedValue>
type TypeDef = string | Array<string> | Record<string, string>

function assertMessageProp(container: Metadata, postMessageType: string, field: string, expectedType: TypeDef) {
  const value = container[field]

  const valueIsDefined = typeof value !== "undefined"
  const valueIsString = typeof value === "string"
  const valueIsNumber = typeof value === "number"
  const valueIsObject = typeof value === "object" && !Array.isArray(value)

  const typeIsString = expectedType === "string"
  const typeIsNumber = expectedType === "number"
  const typeIsArray = expectedType instanceof Array
  const typeIsObject = typeof expectedType === "object" && !Array.isArray(expectedType)

  if (!valueIsDefined) {
    throw new PostMessageFieldDecodeError(postMessageType, field, expectedType, value)
  } else if (typeIsString && !valueIsString) {
    throw new PostMessageFieldDecodeError(postMessageType, field, expectedType, value)
  } else if (typeIsNumber && !valueIsNumber) {
    throw new PostMessageFieldDecodeError(postMessageType, field, expectedType, value)
  } else if (typeIsArray && !(valueIsString && expectedType.includes(value))) {
    throw new PostMessageFieldDecodeError(postMessageType, field, expectedType, value)
  } else if (typeIsObject && !valueIsObject) {
    throw new PostMessageFieldDecodeError(postMessageType, field, expectedType, value)
  } else if (typeIsObject && valueIsObject) {
    Object.keys(expectedType).forEach((field) => {
      assertMessageProp(value, postMessageType, field, expectedType[field])
    })
  }
}

export function buildPayload(type: Type, metadata: Metadata): Payload {
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
{assertions}

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

const stringifyType = (type: FieldType, asCode = false): string => {
  if (typeof type === "string" && asCode) {
    return `"${type}"`
  } else if (typeof type === "string") {
    return type
  } else if (type instanceof Array && asCode) {
    return `[${type.map((v) => `"${v}"`).join(", ")}]`
  } else if (type instanceof Array) {
    return type.map((v) => `"${v}"`).join(" | ")
  }

  const fields: string[] = []
  for (const field in type) {
    fields.push(`${field}: ${stringifyType(type[field], asCode)}`)
  }

  return `{ ${fields.join(", ")} }`
}

export const main = () => {
  console.log("Generating payload definitions")

  const payloadTypes: string[] = []
  const payloadAllTypeNames: string[] = []
  const payloadGenericTypeNames: string[] = []
  const payloadEntityTypeNames: string[] = []
  const payloadWidgetTypeNames: string[] = []
  const buildPayloadCases: string[] = []

  withEachMessageDefinition((namespace, action, defn, defType) => {
    const name = genMessageKey(namespace, action)

    const fields = Object.keys(defn).map((key) => `  ${key}: ${stringifyType(defn[key])}`)
    const payloadTypeTemplate = fields.length > 0 ? payloadFilledTypeTemplate : payloadEmptyTypeTemplate
    const payloadType = merge(payloadTypeTemplate, {
      name,
      fields: fields.join("\n")
    })

    const type = genMessageType(namespace, action)
    const assertions = Object.keys(defn).map((key) => `      assertMessageProp(metadata, "${type}", "${key}", ${stringifyType(defn[key], true)})`)
    const extractions = Object.keys(defn).map((key) => `        ${key}: metadata.${key} as ${stringifyType(defn[key])},`)
    const buildPayloadCaseTemplate = extractions.length > 0 ? buildFilledPayloadCaseTemplate : buildEmptyPayloadCaseTemplate
    const normalizeCase = merge(buildPayloadCaseTemplate, {
      name,
      assertions: assertions.join("\n"),
      extractions: extractions.join("\n"),
    })

    switch (defType) {
      case DefinitionType.Generic:
        payloadGenericTypeNames.push(`  | ${name}Payload`)
        break

      case DefinitionType.Widget:
        payloadWidgetTypeNames.push(`  | ${name}Payload`)
        break

      case DefinitionType.Entity:
        payloadEntityTypeNames.push(`  | ${name}Payload`)
        break
    }

    payloadAllTypeNames.push(`${name}Payload`)
    payloadTypes.push(payloadType)
    buildPayloadCases.push(normalizeCase)
  })

  const code = merge(template, {
    payloadTypes: payloadTypes.join("\n\n"),
    payloadAllTypesUnion: payloadAllTypeNames.join("\n  | "),
    payloadGenericTypesUnion: payloadGenericTypeNames.join("\n"),
    payloadEntityTypesUnion: payloadEntityTypeNames.join("\n"),
    payloadWidgetTypesUnion: payloadWidgetTypeNames.join("\n"),
    buildPayloadCases: buildPayloadCases.join("\n\n    "),
  })

  const dest = join(__dirname, "generated_payloads.ts")
  write(__filename, dest, code)

  console.log("Done generating payload definitions")
}

if (require.main === module) {
  main()
}
