export enum Environment {
  INT = "integration"
}

export const Host = {
  [Environment.INT]: "https://int-api.mx.com",
}

export const environmentLookup: Record<string, Environment> = {
  [Environment.INT]: Environment.INT
}

export function lookupEnvironment(str: string): Environment {
  const env = environmentLookup[str]
  if (!env) {
    throw new Error(`invalid MX environment: ${str}`)
  }

  return env
}
