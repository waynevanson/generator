import { clamp, createPositiveScaler } from "./util"
import * as fc from "fast-check"

const integer = (constraints?: fc.IntegerConstraints) =>
  fc.integer(constraints).filter((a) => !Number.isNaN(a))

describe(clamp, () => {
  it("should keep the same number that is within the range", () => {
    const range = integer()
      .chain((min) => integer({ min }).map((max) => ({ min, max })))
      .chain((range) => integer(range).map((value) => ({ value, range })))

    fc.assert(
      fc.property(range, ({ range, value }) => {
        const result = clamp(value, range)
        expect(result).toBe(value)
      })
    )
  })

  it("should use the min number if the value is at or below the range", () => {
    const range = integer()
      .chain((min) => integer({ min }).map((max) => ({ min, max })))
      .chain((range) =>
        integer({ max: range.min }).map((value) => ({ value, range }))
      )

    fc.assert(
      fc.property(range, ({ range, value }) => {
        const result = clamp(value, range)
        expect(result).toBe(range.min)
      })
    )
  })

  it("should use the max number if the value is at or above the range", () => {
    const range = integer()
      .chain((min) => integer({ min }).map((max) => ({ min, max })))
      .chain((range) =>
        integer({ min: range.max }).map((value) => ({ value, range }))
      )

    fc.assert(
      fc.property(range, ({ range, value }) => {
        const result = clamp(value, range)
        expect(result).toBe(range.max)
      })
    )
  })
})

describe.skip(createPositiveScaler, () => {
  it("should scale a number between ranges if the number is not negative", () => {
    const range = (constraints?: fc.IntegerConstraints) =>
      integer({ min: constraints?.min, max: Number.MAX_SAFE_INTEGER }).chain(
        (min) =>
          integer({
            min,
            max: constraints?.max ?? Number.MAX_SAFE_INTEGER,
          }).map((max) => ({ min, max }))
      )

    const arb = range({ min: 0, max: 2 ** 32 })
      .chain((source) =>
        range({ min: 0, max: 2 ** 32 }).map((target) => ({
          target,
          source,
        }))
      )
      .chain((ranges) =>
        integer(ranges.source).map((value) => ({ value, ranges }))
      )

    fc.assert(
      fc.property(arb, ({ ranges: { source, target }, value }) => {
        const result = createPositiveScaler(source, target)(value)
        if (target.min > source.min)
          expect(result).toBeGreaterThanOrEqual(target.min)
      })
    )
  })
})
