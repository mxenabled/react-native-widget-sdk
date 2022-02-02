import { join } from "path"

import {
  camelCase,
  genMessageKey,
  isParentDefn,
  merge,
  withEachMessageDefinition,
  write,
} from "./generate_utils"

const template = `
import { Type } from "./generated_types"

import {
  Payload,
{payloadTypeImports}
} from "./generated_payloads"

{callbackTypes}

function safeCall<P>(fn: (_: P) => void, payload: P) {
  if (fn) {
    fn(payload)
  }
}

{dispatchFunctions}
`

const callbackTypeTemplate = `
export type {callbackType} = {
{functionTypes}
}
`

const callbackFunctionTypeTemplate = `
{callbackName}: (payload: {payloadType}) => void
`

const dispatchFunctionTemplate = `
export function dispatch{namespaceType}Callback(callbacks: {callbackType}, payload: Payload) {
  switch (payload.type) {
    {callCallbackCases}

    default:
      throw new Error(\`"unable to dispatch post message with unknown type: \${payload.type}"\`)
  }
}
`

const callCallbackCaseTemplate = `
    case Type.{name}:
      safeCall(callbacks.{callbackName}, payload)
      break
`

const main = () => {
  console.log("Generating callback definitions")

  const payloadTypeImports: string[] = []
  const callbackFunctionTypesByNamespace: Record<string, string[]> = {}
  const callbackTypes: string[] = []
  const dispatchFunctions: string[] = []
  const dispatchesByNamespace: Record<string, string[]> = {}

  withEachMessageDefinition((namespace, action, defn) => {
    const name = genMessageKey(namespace, action)
    const callbackName = isParentDefn(action) ? `on${name}` : `on${camelCase(action)}`
    const payloadType = `${name}Payload`

    const callCallbackCase = merge(callCallbackCaseTemplate, { name, callbackName })
    dispatchesByNamespace[namespace] = dispatchesByNamespace[namespace] || []
    dispatchesByNamespace[namespace].push(callCallbackCase)

    const callbackFunctionType = merge(callbackFunctionTypeTemplate, { callbackName, payloadType })
    callbackFunctionTypesByNamespace[namespace] = callbackFunctionTypesByNamespace[namespace] || []
    callbackFunctionTypesByNamespace[namespace].push(`  ${callbackFunctionType}`)

    const payloadTypeImport = `  ${payloadType},`
    payloadTypeImports.push(payloadTypeImport)
  })

  for (const namespace in dispatchesByNamespace) {
    const callbackType = `${camelCase(namespace)}Callback`

    const functionTypes = callbackFunctionTypesByNamespace[namespace].join("\n")
    const callbackTypeDef = merge(callbackTypeTemplate, { callbackType, functionTypes })
    callbackTypes.push(callbackTypeDef)

    const namespaceType = camelCase(namespace)
    const callCallbackCases = dispatchesByNamespace[namespace].join("\n\n    ")
    const dispatchFunction = merge(dispatchFunctionTemplate, { namespaceType, callbackType, callCallbackCases })
    dispatchFunctions.push(dispatchFunction)
  }

  const code = merge(template, {
    payloadTypeImports: payloadTypeImports.join("\n"),
    callbackTypes: callbackTypes.join("\n\n"),
    dispatchFunctions: dispatchFunctions.join("\n\n"),
  })

  const dest = join(__dirname, "generated_callbacks.ts")
  write(__filename, dest, code)

  console.log("Done generating callback definitions")
}

main()
