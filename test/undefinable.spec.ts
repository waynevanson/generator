import * as gen from "../src"

describe(gen.undefinable, () => {
  it("should generate values that are the type, undefined or null", () => {
    const generator = gen.undefinable(gen.seeded)
    const result = generator.range({ seed: 0, size: 10 })
    expect(result).toSatisfyAll(
      (value) => value === undefined || typeof value === "number"
    )
  })
})
