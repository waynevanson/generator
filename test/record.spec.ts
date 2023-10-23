import * as gen from "../src"

describe(gen.record, () => {
  it("should generate properties that are of the property type", () => {
    const properties = ["one", "two"] as const
    const generator = gen.record(gen.constants(properties), gen.number())
    const range = generator.range({ seed: 0, size: 100 })
    expect(range).toSatisfyAll((record) =>
      Object.keys(record).every((key) => properties.includes(key as never)),
    )
  })
})
