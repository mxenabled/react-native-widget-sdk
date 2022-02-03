import { join } from "path"

import {
  DefinitionType,
  camelCase,
  genMessageKey,
  isParentDefn,
  merge,
  withEachMessageDefinition,
  write,
} from "./generate_utils"

const template = `
import { Type } from "./generated_types"
import { Message } from "./message"

import {
{payloadTypeImports}
} from "./generated_payloads"

{callbackTypes}

const namespaces = {
  generic: [
{genericNamespaces}
  ],
  entities: [
{entityNamespaces}
  ],
}

function isGenericMessage(message: Message) {
  return namespaces.generic.includes(message.namespace())
}

function isEntityMessage(message: Message) {
  return namespaces.entities.includes(message.namespace())
}

function safeCall<P>(payload: P, fn?: (_: P) => void) {
  if (fn) {
    fn(payload)
  }
}

{dispatchFunctions}
`

const callbackEntryTypeTemplate = `
export type {callbackType} = GenericCallback & EntityCallback & {
{functionTypes}
}
`

const callbackFinalTypeTemplate = `
export type {callbackType} = {
{functionTypes}
}
`

const callbackFunctionTypeTemplate = `
{callbackName}?: (payload: {payloadType}) => void
`

const dispatchFunctionEntryTemplate = `
export function dispatch{namespaceType}Callback(callbacks: {callbackType}, message: Message) {
  const payload = message.payload()

  if (isGenericMessage(message)) {
    dispatchGenericCallback(callbacks, message)
    return
  } else if (isEntityMessage(message)) {
    dispatchEntityCallback(callbacks, message)
    return
  }

  switch (payload.type) {
    {callCallbackCases}

    default:
      throw new Error(\`"unable to dispatch post message with unknown type: \${payload.type}"\`)
  }
}
`

const dispatchFunctionFinalTemplate = `
export function dispatch{namespaceType}Callback(callbacks: {callbackType}, message: Message) {
  const payload = message.payload()

  switch (payload.type) {
    {callCallbackCases}

    default:
      throw new Error(\`"unable to dispatch post message with unknown type: \${payload.type}"\`)
  }
}
`

const callCallbackCaseTemplate = `
    case Type.{name}:
      safeCall(payload, callbacks.{callbackName})
      break
`

const main = () => {
  console.log("Generating callback definitions")

  const payloadTypeImports: string[] = []
  const callbackFunctionTypesByNamespace: Record<string, string[]> = {}
  const callbackTypes: string[] = []
  const dispatchFunctions: string[] = []
  const dispatchesByNamespace: Record<string, string[]> = {}

  const genericNamespaces = new Set<string>()
  const widgetNamespaces = new Set<string>()
  const entityNamespaces = new Set<string>()

  callbackFunctionTypesByNamespace["generic"] = []
  callbackFunctionTypesByNamespace["entity"] = []

  withEachMessageDefinition((namespace, action, defn, defType) => {
    let group: string
    if (defType === DefinitionType.Generic) {
      group = "generic"
    } else if (defType === DefinitionType.Entity) {
      group = "entity"
    } else {
      group = namespace
    }

    const isEntity = defType === DefinitionType.Entity

    const name = genMessageKey(namespace, action)
    let callbackName: string
    if (isParentDefn(action)) {
      callbackName = `on${name}`
    } else if (isEntity) {
      callbackName = `on${name}`
    } else {
      callbackName = `on${camelCase(action)}`
    }
    const payloadType = `${name}Payload`

    const callCallbackCase = merge(callCallbackCaseTemplate, { name, callbackName })
    dispatchesByNamespace[group] = dispatchesByNamespace[group] || []
    dispatchesByNamespace[group].push(callCallbackCase)

    const callbackFunctionType = merge(callbackFunctionTypeTemplate, { callbackName, payloadType })
    callbackFunctionTypesByNamespace[group] = callbackFunctionTypesByNamespace[group] || []
    callbackFunctionTypesByNamespace[group].push(`  ${callbackFunctionType}`)

    const payloadTypeImport = `  ${payloadType},`
    payloadTypeImports.push(payloadTypeImport)

    switch(defType) {
      case DefinitionType.Generic:
        genericNamespaces.add(namespace)
        break

      case DefinitionType.Widget:
        widgetNamespaces.add(namespace)
        break

      case DefinitionType.Entity:
        entityNamespaces.add(namespace)
        break
    }
  })

  for (const namespace in callbackFunctionTypesByNamespace) {
    const isWidget = Array.from(widgetNamespaces).includes(namespace)
    const callbackType = `${camelCase(namespace)}Callback`

    const functionTypes = callbackFunctionTypesByNamespace[namespace].join("\n")
    const callbackTypeTemplate = isWidget ? callbackEntryTypeTemplate : callbackFinalTypeTemplate
    const callbackTypeDef = merge(callbackTypeTemplate, { callbackType, functionTypes })
    callbackTypes.push(callbackTypeDef)

    const namespaceType = camelCase(namespace)
    const callCallbackCases = dispatchesByNamespace[namespace].join("\n\n    ")
    const dispatchFunctionTemplate = isWidget ? dispatchFunctionEntryTemplate : dispatchFunctionFinalTemplate
    const dispatchFunction = merge(dispatchFunctionTemplate, { namespaceType, callbackType, callCallbackCases })
    dispatchFunctions.push(dispatchFunction)
  }

  const code = merge(template, {
    payloadTypeImports: payloadTypeImports.join("\n"),
    callbackTypes: callbackTypes.join("\n\n"),
    dispatchFunctions: dispatchFunctions.join("\n\n"),
    genericNamespaces: Array.from(genericNamespaces).map((ns) => `    "${ns}",`).join("\n"),
    widgetNamespaces: Array.from(widgetNamespaces).map((ns) => `    "${ns}",`).join("\n"),
    entityNamespaces: Array.from(entityNamespaces).map((ns) => `    "${ns}",`).join("\n"),
  })

  const dest = join(__dirname, "generated_callbacks.ts")
  write(__filename, dest, code)

  console.log("Done generating callback definitions")
}

main()
