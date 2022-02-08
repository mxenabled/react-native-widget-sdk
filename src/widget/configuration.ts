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

// See "Configuration options" section in
// https://docs.mx.com/api#connect_request_a_url
export type BaseOptions = {
  widget_type: Type
  is_mobile_webview?: boolean
  ui_message_version?: number
  color_scheme?: "dark" | "light"
}

export type ConnectWidgetOptions = Partial<BaseOptions> & {
  mode?: ConnectWidgetMode
}
