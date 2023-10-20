import * as gen from "../src"

describe(gen.negative, () => {
  it("should generate numbers below 0", () => {
    const results = gen.negative().range({
      seed: 0,
      size: 100,
    })
    expect(results).toSatisfyAll((number) => number <= 0)
  })
})
