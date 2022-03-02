/* istanbul ignore file */

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

export const main = () => {
  console.log("Generating type definitions")

  const typeDefLines: string[] = []
  const typeMapLines: string[] = []

  withEachMessageDefinition((namespace, action, _defn) => {
    const key = genMessageKey(namespace, action)
    const type = genMessageType(namespace, action)
    const urlSafeType = genMessageType(namespace.toLowerCase(), action)

    typeDefLines.push(`  ${key} = "${type}",`)
    typeMapLines.push(`  [Type.${key}]: Type.${key},`)

    /* From https://datatracker.ietf.org/doc/html/rfc3986#section-3.2.2:
     *
     * > Although host is case-insensitive, producers and normalizers should use
     * > lowercase for registered names and hexadecimal addresses for the sake of
     * > uniformity, while only using uppercase letters for percent-encodings.
     *
     * Because of this, our URL parser will convert the host to lowercase which
     * causes problems when we do a type lookup. We introduce a lowercased
     * entry so that when doing a lookup with a lowercased host (the namespace)
     * we get a match.
     */
    if (urlSafeType !== type)  {
      typeMapLines.push(`  ["${urlSafeType}"]: Type.${key},`)
    }
  })

  const code = merge(template, {
    typeDefLines: typeDefLines.join("\n"),
    typeMapLines: typeMapLines.join("\n"),
  })

  const dest = join(__dirname, "generated_types.ts")
  write(__filename, dest, code)

  console.log("Done generating type definitions")
}

if (require.main === module) {
  main()
}
