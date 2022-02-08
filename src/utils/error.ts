export function asError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  } else if (typeof error === "string") {
    new Error(error)
  }

  return new Error(
    ((error || {}) as { valueOf(): string }).valueOf()
  )
}
