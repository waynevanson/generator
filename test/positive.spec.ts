import * as gen from "../src"

describe(gen.positive, () => {
  it("should generate numbers below 0", () => {
    expect(gen.decimal).toBeInstanceOf(gen.Gen)
    const results = gen.positive().range({
      seed: 0,
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number >= 0)
  })
})