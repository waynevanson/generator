import * as gen from "../src"

describe(gen.union, () => {
  it("should generate a disjunction of the values provided", () => {
    const generator = gen.union([gen.integer(), gen.string(), gen.boolean])

    const result = generator.range({ seed: 0, size: 100 })

    expect(result).toSatisfyAll((value) =>
      ["string", "number", "boolean"].includes(typeof value),
    )
  })

  it("should ", () => {
    const generator = gen.union(
      [gen.integer(), gen.string(), gen.boolean] as const,
      [0.25, 0.25, 0.5],
    )

    const result = generator.range({ seed: 0, size: 100 })

    expect(result).toSatisfyAll((value) =>
      ["string", "number", "boolean"].includes(typeof value),
    )
  })
})
