import * as gen from "../src"

describe(gen.required, () => {
  it("should contain all properties provided", () => {
    const inputs = {
      one: gen.char(),
      two: gen.number(),
      three: gen.boolean,
    }
    const generator = gen.required(inputs)
    const range = generator.range({ seed: 0, size: 100 })
    const keys = Object.keys(inputs)
    expect(range).toSatisfyAll((required) =>
      Object.keys(required).every((key) => keys.includes(key)),
    )
  })
})
