import * as gen from "../src"

describe(gen.partial, () => {
  it("should sometimes contain each of the properties", () => {
    const generator = gen.partial({
      first: gen.seeded,
      second: gen.char(),
    })
    const result = generator.range({ seed: 0, size: 10 })

    expect(result).toSatisfyAny((value) => "first" in value)
    expect(result).toSatisfyAny((value) => "second" in value)
    expect(result).toSatisfyAny((value) => !("first" in value))
    expect(result).toSatisfyAny((value) => !("second" in value))
  })

  it("should sometimes contain each of the properties while distributing", () => {
    const generator = gen.partial(
      {
        first: gen.seeded,
        second: gen.char(),
      },
      { first: 0.7 }
    )
    const result = generator.range({ seed: 0, size: 10 })

    expect(result).toSatisfyAny((value) => "first" in value)
    expect(result).toSatisfyAny((value) => "second" in value)
    expect(result).toSatisfyAny((value) => !("first" in value))
    expect(result).toSatisfyAny((value) => !("second" in value))
  })
})
