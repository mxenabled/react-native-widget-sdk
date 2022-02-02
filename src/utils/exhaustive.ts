export function exhaustive<T>(value: never): never;
export function exhaustive<T>(value: T) {
  throw new Error(`unhandled case for ${value}`)
}

