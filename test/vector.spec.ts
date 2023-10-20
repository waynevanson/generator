import * as gen from "../src"

describe(gen.vector, () => {
  it("should generate an array with a fixed size", () => {
    const size = 10
    const generator = gen.vector(gen.seeded, size)
    const result = generator.range({ seed: 0, size: 10 })
    expect(result).toSatisfyAll((vector) => vector.length === size)
  })

  it("should contain distinct values when the seed can generate distinct", () => {
    const size = 10
    const generator = gen.vector(gen.seeded, size)
    const result = generator.range({ seed: 0, size: 10 })

    expect(result).toSatisfyAll((array: Array<number>) =>
      array.every((seed, index) => {
        const excluded = array.slice()
        excluded.splice(index, 1)
        return excluded.every((excluded) => excluded !== seed)
      })
    )
  })
})
