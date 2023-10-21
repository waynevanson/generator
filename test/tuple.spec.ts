import * as gen from "../src"

describe(gen.tuple, () => {
  it("should generate tuples with a length of the generators provided", () => {
    const generator = gen.tuple([gen.seeded, gen.char()])
    const result = generator.range({ seed: 0, size: 10 })
    expect(result).toSatisfyAll((value) => value.length == 2)
  })

  it("should match the value in each index", () => {
    const generator = gen.tuple([gen.seeded, gen.char()])
    const result = generator.range({ seed: 0, size: 10 })
    expect(result).toSatisfyAll(
      (value) => typeof value[0] === "number" && typeof value[1] === "string"
    )
  })
})
