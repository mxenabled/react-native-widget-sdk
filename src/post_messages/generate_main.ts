import { loadDefinitions } from "./generate_utils"
import { main as generateCallbacks } from "./generate_callbacks"
import { main as generatePayloads } from "./generate_payloads"
import { main as generateTypes } from "./generate_types"

loadDefinitions()

console.log()
generateCallbacks()

console.log()
generatePayloads()

console.log()
generateTypes()
