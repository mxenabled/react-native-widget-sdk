import { readFileSync, writeFileSync } from "fs"
import { join } from "path"
import YAML from "yaml"

YAML.defaultOptions.merge = true

export type NamespaceDefinition = {
  [index: string]: ActionDefinition
}

export type ActionDefinition = {
  [index: string]: MessageDefinition
}

export type MessageDefinition = {
  [index: string]: "string" | "number"
}

export const withEachMessageDefinition = <R>(cb: (ns: string, action: string, defn: MessageDefinition) => R): R[] => {
  const namespaces = loadNamespaces()
  const results: R[] = []

  for (const namespace in namespaces) {
    const actions = namespaces[namespace]
    for (const action in actions) {
      results.push(cb(namespace, action, actions[action]))
    }
  }

  return results
}

export const loadNamespaces = (): NamespaceDefinition => {
  const defsFile = join(__dirname, "./event_definitions.yml")
  console.log(`Loading post message event definitions from ${defsFile}`)

  const defsData = readFileSync(defsFile)
  const data =  YAML.parse(defsData.toString()) as { namespaces: NamespaceDefinition }
  return data.namespaces
}

export const write = (dest: string, contents: string) => {
  if (contents[contents.length - 1] !== "\n") {
    contents = contents + "\n"
  }
  console.log("Writing %d bytes to %s", contents.length, dest)
  writeFileSync(dest, contents)
}

export const merge = (template: string, fields: Record<string, string>) =>
  Object.keys(fields).reduce((str, field) =>
    str.replace(new RegExp(`{${field}}`, "g"), fields[field]), template).trim()

export const genMessageKey = (namespace: string, action: string) =>
  camelCase(isParentDefn(action) ? namespace : `${namespace}_${action}`)

export const genMessageType =(namespace: string, action: string) =>
  isParentDefn(action) ? `mx/${namespace}` : `mx/${namespace}/${action}`

export const isParentDefn = (action: string) =>
  action === "_"

export const camelCase = (str: string) =>
  str
    .replace(/(^[a-z])/i, (match) => match.toUpperCase())
    .replace(/([-_][a-z])/ig, (match) => match.toUpperCase())
    .replace("-", "")
    .replace("_", "")
