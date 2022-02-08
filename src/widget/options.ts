import { Type } from "./widgets"

// See "Configuration options" section in
// https://docs.mx.com/api#connect_request_a_url
export type Options<Mode> = {
  widget_type: Type
  is_mobile_webview?: boolean
  ui_message_version?: number
  color_scheme?: "dark" | "light"
  mode?: Mode
}
