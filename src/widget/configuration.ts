/**
 * See "Configuration options" section in
 * https://docs.mx.com/api#connect_request_a_url for more details.
 */

export enum Type {
  ConnectWidget = "connect_widget",
  PulseWidget = "pulse_widget",
}

type CWM =
  | "verification"
  | "aggregation"

export type ConnectWidgetMode =
  | `${CWM}`
  | `${CWM},${CWM}`
  | `${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`
  | `${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM},${CWM}`

// Taken from https://stackoverflow.com/a/63715429, thank you!!
type Camelize<T> = { [K in keyof T as CamelizeString<K>]: T[K] }
type CamelizeString<T extends PropertyKey, C extends string = ""> =
  T extends string ? string extends T ? string :
    T extends `${infer F}_${infer R}` ?
      CamelizeString<Capitalize<R>, `${C}${F}`> : `${C}${T}` : T;

export type InternalWidgetOptions = WidgetOptions & {
  widget_type: Type
  is_mobile_webview?: boolean
  ui_message_version?: number
}

export type WidgetOptionProps = Camelize<WidgetOptions>
export type WidgetOptions = {
  ui_message_webview_url_scheme?: string
  color_scheme?: "dark" | "light"
}

export type ConnectWidgetOptionProps = Camelize<ConnectWidgetOptions>
export type ConnectWidgetOptions = WidgetOptions & {
  client_redirect_url?: string
  current_institution_code?: string
  current_institution_guid?: string
  current_member_guid?: string
  disable_institution_search?: boolean
  include_transactions?: boolean
  mode?: ConnectWidgetMode
  oauth_referral_source?: string
  update_credentials?: boolean
  wait_for_full_aggregation?: boolean
}

export function widgetOptionsFromProps(props: WidgetOptionProps): WidgetOptions {
  return {
    color_scheme: props.colorScheme,
  }
}

export function connectWidgetOptionsFromProps(props: ConnectWidgetOptionProps): ConnectWidgetOptions {
  return {
    ...widgetOptionsFromProps(props),
    client_redirect_url: props.clientRedirectUrl,
    current_institution_code: props.currentInstitutionCode,
    current_institution_guid: props.currentInstitutionGuid,
    current_member_guid: props.currentMemberGuid,
    disable_institution_search: props.disableInstitutionSearch,
    include_transactions: props.includeTransactions,
    mode: props.mode,
    oauth_referral_source: props.oauthReferralSource,
    update_credentials: props.updateCredentials,
    wait_for_full_aggregation: props.waitForFullAggregation,
  }
}
