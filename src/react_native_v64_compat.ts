/* removeEventListener has been remove but addEventListener does not return a
 * subscription object in versions of React Native v0.64 or below. We can
 * delete this file when v64 (or below) is no longer supported.
 */

export type RNv64Compat<T> = T & {
  removeEventListener(type: "url", handler: unknown): void
  removeEventListener(type: "change", handler: unknown): void
}

// import "react-native"
//
// declare module "react-native" {
//   export interface LinkingStatic {
//     removeEventListener(type: "url", handler: unknown): void
//   }
//
//   export interface Dimensions {
//     removeEventListener(type: "change", handler: unknown): void
//   }
// }
