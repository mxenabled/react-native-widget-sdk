export function exhaustive(value: never): never;
/* istanbul ignore next */
export function exhaustive<T>(value: T) {
  throw new Error(`unhandled case for ${value}`)
}
