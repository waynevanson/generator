import * as gen from "../src"

describe(gen.optional, () => {
  it("should generate values that are the type, undefined or null", () => {
    const generator = gen.optional(gen.seeded)
    const result = generator.range({ seed: 0, size: 10 })
    expect(result).toSatisfyAll(
      (value) => value == null || typeof value === "number"
    )
  })
})
