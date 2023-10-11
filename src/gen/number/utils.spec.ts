import { clamp, createPositiveScaler } from "./util"
import * as fc from "fast-check"

describe(clamp, () => {
  it("should keep the same number that is within the range", () => {
    const range = fc
      .integer()
      .chain((min) => fc.integer({ min }).map((max) => ({ min, max })))
      .chain((range) => fc.integer(range).map((value) => ({ value, range })))

    fc.assert(
      fc.property(range, ({ range, value }) => {
        const result = clamp(value, range)
        expect(result).toBe(value)
      })
    )
  })

  it("should use the min number if the value is at or below the range", () => {
    const range = fc
      .integer()
      .chain((min) => fc.integer({ min }).map((max) => ({ min, max })))
      .chain((range) =>
        fc.integer({ max: range.min }).map((value) => ({ value, range }))
      )

    fc.assert(
      fc.property(range, ({ range, value }) => {
        const result = clamp(value, range)
        expect(result).toBe(range.min)
      })
    )
  })

  it("should use the max number if the value is at or above the range", () => {
    const range = fc
      .integer()
      .chain((min) => fc.integer({ min }).map((max) => ({ min, max })))
      .chain((range) =>
        fc.integer({ min: range.max }).map((value) => ({ value, range }))
      )

    fc.assert(
      fc.property(range, ({ range, value }) => {
        const result = clamp(value, range)
        expect(result).toBe(range.max)
      })
    )
  })
})

describe(createPositiveScaler, () => {
  it("should scale a number between ranges if the number is not negative", () => {
    const range = (constraints?: fc.IntegerConstraints) =>
      fc
        .integer({ min: constraints?.min, max: Number.MAX_SAFE_INTEGER })
        .chain((min) =>
          fc
            .integer({ min, max: constraints?.max ?? Number.MAX_SAFE_INTEGER })
            .map((max) => ({ min, max }))
        )

    const arb = range({ min: 0, max: Number.MAX_SAFE_INTEGER })
      .chain((source) =>
        range({ min: 0, max: Number.MAX_SAFE_INTEGER }).map((target) => ({
          target,
          source,
        }))
      )
      .chain((ranges) =>
        fc.integer(ranges.source).map((value) => ({ value, ranges }))
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
