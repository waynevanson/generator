import * as gen from "../src"

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
