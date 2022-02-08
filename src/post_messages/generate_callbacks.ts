/* istanbul ignore file */

import { join } from "path"

import {
  DefinitionType,
  normalizeCasing,
  genMessageKey,
  isParentDefn,
  merge,
  withEachMessageDefinition,
  write,
} from "./generate_utils"

const template = `
import { WebViewNavigation } from "react-native-webview"

import { Type } from "./generated_types"
import { Message } from "./message"

import {
{payloadTypeImports}
} from "./generated_payloads"

{callbackTypes}

// Thrown when we are unable to process an otherwise valid post message
// request. Used to trigger the \`onCallbackDispatchError\` callback.
class CallbackDispatchError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CallbackDispatchError.prototype);
  }
}

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

function safeCall(args: [], fn?: () => void): void
function safeCall<P1>(args: [P1], fn?: (...args: [P1]) => void): void
function safeCall<P1, P2>(args: [P1, P2], fn?: (...args: [P1, P2]) => void): void
function safeCall<P1, P2, P3>(args: [P1, P2, P3], fn?: (...args: [P1, P2, P3]) => void): void
function safeCall<P1, P2, P3, P4>(args: [P1, P2, P3, P4], fn?: (...args: [P1, P2, P3, P4]) => void): void
function safeCall<P1, P2, P3, P4, P5>(args: [P1, P2, P3, P4, P5], fn?: (...args: [P1, P2, P3, P4, P5]) => void): void
function safeCall<Ps>(args: Ps[], fn?: (...args: Ps[]) => void): void {
  if (fn) {
    fn(...args)
  }
}

{dispatchFunctions}
`

const callbackEntryTypeTemplate = `
export type {callbackType} = ErrorCallbackProps & GenericCallbackProps & EntityCallbackProps & {
{functionTypes}
}
`

const callbackFinalTypeTemplate = `
export type {callbackType} = {
{functionTypes}
}
`

const unknownRequestCallbackName = "onUnkownRequestIntercept"
const unknownRequestCallbackFunctionTypeTemplate = `
${unknownRequestCallbackName}?: (request: WebViewNavigation) => void
`

const callbackDispatchErrorCallbackName = "onCallbackDispatchError"
const callbackDispatchErrorCallbackFunctionTypeTemplate = `
${callbackDispatchErrorCallbackName}?: (request: WebViewNavigation, error: Error) => void
`

const callbackFunctionTypeTemplate = `
{callbackName}?: (payload: {payloadType}) => void
`

const dispatchFunctionEntryTemplate = `
export function handle{namespaceType}Request(callbacks: {callbackType}, request: WebViewNavigation) {
  const message = new Message(request.url)
  if (!message.isValid()) {
    safeCall([request], callbacks.onUnkownRequestIntercept)
    return
  }

  try {
    dispatch{namespaceType}Callback(callbacks, message)
  } catch (error) {
    // \`CallbackDispatchError\` is an internal error so pass that back to the
    // host via the \`onCallbackDispatchError\` callback. Any other errors are
    // from user space and should bubble back up to the host.
    if (error instanceof CallbackDispatchError) {
      safeCall([request, error], callbacks.onCallbackDispatchError)
    } else {
      throw error
    }
  }
}

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
      throw new CallbackDispatchError(\`"unable to dispatch post message with unknown type: \${payload.type}"\`)
  }
}
`

const dispatchFunctionFinalTemplate = `
export function dispatch{namespaceType}Callback(callbacks: {callbackType}, message: Message) {
  const payload = message.payload()

  switch (payload.type) {
    {callCallbackCases}

    default:
      throw new CallbackDispatchError(\`"unable to dispatch post message with unknown type: \${payload.type}"\`)
  }
}
`

const callCallbackCaseTemplate = `
    case Type.{name}:
      safeCall([payload], callbacks.{callbackName})
      break
`

export const main = () => {
  console.log("Generating callback definitions")

  const payloadTypeImports: string[] = []
  const callbackFunctionTypesByNamespace: Record<string, string[]> = {}
  const callbackTypes: string[] = []
  const dispatchFunctions: string[] = []
  const dispatchesByNamespace: Record<string, string[]> = {}

  const genericNamespaces = new Set<string>()
  const widgetNamespaces = new Set<string>()
  const entityNamespaces = new Set<string>()

  callbackFunctionTypesByNamespace["error"] = [
    `  ${merge(unknownRequestCallbackFunctionTypeTemplate, {})}`,
    `  ${merge(callbackDispatchErrorCallbackFunctionTypeTemplate, {})}`,
  ]
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
      callbackName = `on${normalizeCasing(action)}`
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
    const callbackType = `${normalizeCasing(namespace)}CallbackProps`

    const functionTypes = callbackFunctionTypesByNamespace[namespace].join("\n")
    const callbackTypeTemplate = isWidget ? callbackEntryTypeTemplate : callbackFinalTypeTemplate
    const callbackTypeDef = merge(callbackTypeTemplate, { callbackType, functionTypes })
    callbackTypes.push(callbackTypeDef)

    // Error dispatches are generated separately so they won't be in
    // `dispatchesByNamespace`.
    if (namespace in dispatchesByNamespace) {
      const namespaceType = normalizeCasing(namespace)
      const callCallbackCases = dispatchesByNamespace[namespace].join("\n\n    ")
      const dispatchFunctionTemplate = isWidget ? dispatchFunctionEntryTemplate : dispatchFunctionFinalTemplate
      const dispatchFunction = merge(dispatchFunctionTemplate, { namespaceType, callbackType, callCallbackCases })
      dispatchFunctions.push(dispatchFunction)
    }
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

if (require.main === module) {
  main()
}
