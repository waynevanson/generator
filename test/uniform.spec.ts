import { SEED_MAX, SEED_MIN, uniform } from "../src"
import fc from "fast-check"

describe(uniform, () => {
  it("should throw an error when the max size is less than 1", () => {
    expect(() => uniform(0)).toThrowError()
  })

  it("should generate a range of values between 0 and the max size", () => {
    const integer = (options: fc.IntegerConstraints) =>
      fc.integer(options).filter((a) => !Number.isNaN(a))
    const seed = integer({ min: SEED_MIN, max: SEED_MAX })
    const size = integer({ min: SEED_MIN + 1, max: SEED_MAX })

    fc.assert(
      fc.property(seed, size, (seed, size) => {
        const generator = uniform(size)
        const result = generator.run(seed)
        expect(result).toBeGreaterThanOrEqual(SEED_MIN)
        expect(result).toBeLessThanOrEqual(size)
      }),
    )
  })
})
