export enum Type {
  Load = "mx/load",
  ConnectLoaded = "mx/connect/loaded",
  ConnectStepChange = "mx/connect/stepChange",
}

export const typeMap: Record<string, Type> = {
  [Type.Load]: Type.Load,
  [Type.ConnectLoaded]: Type.ConnectLoaded,
  [Type.ConnectStepChange]: Type.ConnectStepChange,
}
