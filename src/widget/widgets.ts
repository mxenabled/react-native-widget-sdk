export enum Type {
  ConnectWidget = "connect_widget",
}

type CWM
  = "verification"
  | "aggregation"

export type ConnectWidgetMode
  = `${CWM}`
  | `${CWM},${CWM}`
  | `${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
