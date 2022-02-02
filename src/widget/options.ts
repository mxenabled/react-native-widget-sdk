import { Type } from "./type"

export type Options = {
  widget_type: Type
  is_mobile_webview?: boolean
  ui_message_version?: number
  color_scheme?: "dark" | "light"
}
