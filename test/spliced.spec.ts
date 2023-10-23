import * as gen from "../src"

describe(gen.spliced, () => {
  it("should keep elements in the same order", () => {
    const values = ["a", "b", "c", "d", "e", "f"]
    const generator = gen.spliced(values, 0.5)
    const range = generator.range({ seed: 0, size: 100 })

    expect(range).toSatisfyAll((array: Array<string>) =>
      array.every((current, index, array) => {
        if (index === 0) return true
        const previous = array[index - 1]
        const previousIndex = values.indexOf(previous)
        const currentIndex = values.indexOf(current)
        return previousIndex < currentIndex
      })
    )
  })

  it("should use 0.5 as the default value when the parameter is omitted", () => {
    const values = ["a", "b", "c", "d", "e", "f"]
    const one = gen.spliced(values, 0.5)
    const first = one.range({ seed: 0, size: 100 })
    const two = gen.spliced(values)
    const second = two.range({ seed: 0, size: 100 })

    expect(first).toStrictEqual(second)
  })

  it("should remove a mostly fixed amountof values", () => {
    const generator = gen.spliced(["a", "b", "c", "d", "e", "f"], 0.5)
    const range = generator.range({ seed: 0, size: 100 })
    expect(range).toSatisfyAll((array) => array.length === 3)
  })

  it("should remove a mostly fixed amountof values when skips is not even", () => {
    const generator = gen.spliced(["a", "b", "c", "d", "e", "f"], 0.4)
    const range = generator.range({ seed: 0, size: 100 })
    expect(range).toSatisfyAll(
      (array) => array.length === 3 || array.length === 4
    )
  })
})
