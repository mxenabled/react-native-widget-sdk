import { join } from "path"

import {
  genMessageKey,
  genMessageType,
  merge,
  withEachMessageDefinition,
  write,
} from "./generate_utils"

const template = `
export enum Type {
{typeDefLines}
}

export const typeLookup: Record<string, Type> = {
{typeMapLines}
}
`

const main = () => {
  console.log("Generating type definitions")

  const typeDefLines: string[] = []
  const typeMapLines: string[] = []

  withEachMessageDefinition((namespace, action, defn) => {
    const key = genMessageKey(namespace, action)
    const type = genMessageType(namespace, action)
    typeDefLines.push(`  ${key} = "${type}",`)
    typeMapLines.push(`  [Type.${key}]: Type.${key},`)
  })

  const code = merge(template, {
    typeDefLines: typeDefLines.join("\n"),
    typeMapLines: typeMapLines.join("\n"),
  })

  const dest = join(__dirname, "generated_types.ts")
  write(__filename, dest, code)

  console.log("Done generating type definitions")
}

main()
