import { Gen } from "./class"
import { decimal, negative, number, positive } from "./number"
import { lcg } from "../lcg"

describe("decimal", () => {
  it("should generate numbers between 0 and 1", () => {
    expect(decimal).toBeInstanceOf(Gen)
    const results = decimal.range({ state: { seed: 0, lcg: lcg }, size: 100 })
    expect(results).toSatisfyAll((number) => number >= 0 || number <= 1)
  })
})

describe(negative, () => {
  it("should generate numbers below 0", () => {
    expect(decimal).toBeInstanceOf(Gen)
    const results = negative().range({
      state: { seed: 0, lcg: lcg },
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number <= 0)
  })
})

describe(positive, () => {
  it("should generate numbers below 0", () => {
    expect(decimal).toBeInstanceOf(Gen)
    const results = positive().range({
      state: { seed: 0, lcg: lcg },
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number >= 0)
  })
})

describe(number, () => {
  it("should generate numbers that are not decimals", () => {
    expect(decimal).toBeInstanceOf(Gen)
    const results = number().range({
      state: { seed: 0, lcg: lcg },
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number % 1 == 0)
  })
})
