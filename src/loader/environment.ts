export enum Environment {
  SAND = "sand",
  QA = "qa",
  INT = "integration",
  PROD = "production",
}

export const Host: Record<Environment, string> = {
  [Environment.SAND]: "https://api.sand.internal.mx",
  [Environment.QA]: "https://api.qa.internal.mx",
  [Environment.INT]: "https://int-api.mx.com",
  [Environment.PROD]: "https://api.mx.com",
}

export const environmentLookup: Record<string, Environment> = {
  [Environment.SAND]: Environment.SAND,
  [Environment.QA]: Environment.QA,
  [Environment.INT]: Environment.INT,
  [Environment.PROD]: Environment.PROD,
}

export function lookupEnvironment(str: string): Environment {
  const env = environmentLookup[str]
  if (!env) {
    throw new Error(`invalid MX environment: ${str}`)
  }

  return env
}
