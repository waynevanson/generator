import fc from "fast-check"
import * as gen from "../src"

const integer = (options: fc.IntegerConstraints) =>
  fc.integer(options).filter((a) => !Number.isNaN(a))

const seed = integer({ min: gen.SEED_MIN, max: gen.SEED_MAX })

describe(gen.integer, () => {
  it("should generate numbers that are not decimals", () => {
    expect(gen.decimal).toBeInstanceOf(gen.Gen)
    const results = gen.integer().range({
      seed: 0,
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number % 1 == 0)
  })

  it("should generate numbers without bias in the range", () => {
    const options = integer({ min: 0, max: 2 ** 32 }).chain((min) =>
      integer({ min, max: 2 ** 32 }).map((max) => ({ min, max })),
    )

    fc.assert(
      fc.property(options, seed, (options, seed) => {
        const result = gen.integer(options).run(seed)

        expect(result).toBeGreaterThanOrEqual(options.min)
        expect(result).toBeLessThanOrEqual(options.max)
      }),
    )
  })
})
