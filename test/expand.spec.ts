import * as gen from "../src"

describe(gen.expand, () => {
  it("should apply the reduce and accumulate the value", () => {
    const accumulator = [] as Array<never>
    const generator = gen.expand(
      gen.char(),
      (accumulator) => [accumulator, true] as const,
      accumulator,
    )

    const range = generator.range({ seed: 0, size: 100 })
    expect(range).toSatisfyAll((value) => Object.is(value, accumulator))
  })

  it("should increment the seed whilst applying the generator", () => {
    const accumulator = [] as Array<number>
    const generator = gen.expand(
      gen.seeded,
      (accumulator, current) => {
        accumulator.push(current)
        return [accumulator, true] as const
      },
      accumulator,
    )

    const range = generator.range({ seed: 0, size: 100 })
    expect(range).toSatisfyAll((array: Array<number>) =>
      array.every((seed, index) => {
        const excluded = array.slice()
        excluded.splice(index, 1)
        return excluded.every((excluded) => excluded !== seed)
      }),
    )
  })
})
