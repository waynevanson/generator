import fc from "fast-check"
import * as gen from "../src"

const integer = (options: fc.IntegerConstraints) =>
  fc.integer(options).filter((a) => !Number.isNaN(a))

const seed = integer({ min: gen.SEED_MIN, max: gen.SEED_MAX })

describe(gen.record, () => {
  it("should generate properties that are of the property type", () => {
    fc.assert(
      fc.property(seed, (seed) => {
        const properties = ["one", "two"] as const
        const generator = gen.record(gen.constants(properties), gen.number())
        const record = generator.run(seed)
        expect(Object.keys(record)).toSatisfyAll((key) =>
          properties.includes(key),
        )
      }),
    )
  })
})
