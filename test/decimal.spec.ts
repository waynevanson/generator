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
