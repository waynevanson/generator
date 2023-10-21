import * as gen from "../src"

describe(gen.nullable, () => {
  it("should generate values that are the type, undefined or null", () => {
    const generator = gen.nullable(gen.seeded)
    const result = generator.range({ seed: 0, size: 10 })
    expect(result).toSatisfyAll(
      (value) => value === null || typeof value === "number"
    )
  })
})
