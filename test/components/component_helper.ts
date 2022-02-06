import { act } from "react-test-renderer"

const wait = 5
const timeout = 100

const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })

export const waitFor = async <T>(fn: () => Promise<T>): Promise<T> => {
  for (let i = 0; i < timeout; i++) {
    try {
      let ret = await fn()
      if (ret) {
        return await fn()
      }
    } catch(error) {}

    await act(async () => await sleep(wait))
  }

  throw new Error("Timedout waiting for assertion")
}
