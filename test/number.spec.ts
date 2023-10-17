import * as gen from "../src"

describe("decimal", () => {
  it("should generate numbers between 0 and 1", () => {
    expect(gen.decimal).toBeInstanceOf(gen.Gen)
    const results = gen.decimal.range({
      state: { seed: 0 },
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number >= 0 || number <= 1)
  })
})

describe(gen.negative, () => {
  it("should generate numbers below 0", () => {
    expect(gen.decimal).toBeInstanceOf(gen.Gen)
    const results = gen.negative().range({
      state: { seed: 0 },
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number <= 0)
  })
})

describe(gen.positive, () => {
  it("should generate numbers below 0", () => {
    expect(gen.decimal).toBeInstanceOf(gen.Gen)
    const results = gen.positive().range({
      state: { seed: 0 },
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number >= 0)
  })
})

describe(gen.integer, () => {
  it("should generate numbers that are not decimals", () => {
    expect(gen.decimal).toBeInstanceOf(gen.Gen)
    const results = gen.integer().range({
      state: { seed: 0 },
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number % 1 == 0)
  })
})
