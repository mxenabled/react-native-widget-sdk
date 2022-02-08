/**
 * See "Configuration options" section in
 * https://docs.mx.com/api#connect_request_a_url for more details.
 */

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

export type BaseWidgetOptions = {
  widget_type: Type
  is_mobile_webview?: boolean
  ui_message_version?: number
  color_scheme?: "dark" | "light"
}

export type ConnectOptions = {
  mode?: ConnectWidgetMode
}

export type ConnectWidgetOptions
  = ConnectOptions
  & Partial<BaseWidgetOptions>
