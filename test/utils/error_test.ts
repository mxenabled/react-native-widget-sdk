import { asError } from "../../src/utils/error"

describe("asError", () => {
  test("with an Error", () => {
    expect(asError(new Error(""))).toBeInstanceOf(Error)
  })

  test("with a string", () => {
    const error = asError("sad little string")
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe("sad little string")
  })

  test("with something else", () => {
    const error = asError({ ok: false })
    expect(error).toBeInstanceOf(Error)
  })
})
