export enum Type {
  Load = "mx/load",
  ConnectLoaded = "mx/connect/loaded",
  ConnectStepChange = "mx/connect/stepChange",
}

export const typeMap: Record<string, Type> = {}
for (const typ in Type) {
  typeMap[Type[typ]] = Type[typ]
}
