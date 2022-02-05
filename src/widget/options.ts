import { Type } from "./widgets"

export type Options<Mode> = {
  widget_type: Type
  is_mobile_webview?: boolean
  ui_message_version?: number
  color_scheme?: "dark" | "light"
  mode?: Mode
}
