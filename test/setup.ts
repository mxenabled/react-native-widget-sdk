import fetch from "node-fetch"

/* The type cast of `global.fetch` to `unknown` is needed because the global
 * `fetch`'s type definition comes from React Native, which is incompatible
 * with the one from the `node-fetch` module. As far as I can tell, there are
 * no run-time differences that impact the behavior we're testing, so using
 * `node-fetch` is a safe alternative to React Native's `fetch`.
 */
(global.fetch as unknown) = fetch
