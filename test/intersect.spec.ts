import * as gen from "../src"

describe(gen.intersect, () => {
  it("should merge the properties of two object", () => {
    const first = gen.of({ first: "hello" })
    const second = gen.of({ second: 2 })
    const third = gen.of({ third: true })

    const generator = gen.intersect([first, second, third])
    const results = generator.range({
      state: { seed: 0 },
      size: 10,
    })

    const expected = [
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
      { first: "hello", second: 2, third: true },
    ]

    expect(results).toStrictEqual(expected)
  })
})
