import { count } from "console"
import { sized } from "../src"

describe(sized, () => {
  it("should throw an error when the length of distribution is not equal to the max size", () => {
    expect(() => sized(5, [0.1, 0.15, 0.2, 0.25, 0.2, 0.1])).toThrowError()
  })

  it("should throw an error when the sum of the distribution is not equal to 1", () => {
    expect(() => sized(5, [0.1, 0.15, 0.2, 0.25, 0.2])).toThrowError()
  })

  it("should throw an error when the max size is less than 1", () => {
    expect(() => sized(0, [])).toThrowError()
  })

  it("should generate a range of values between 0 and the max size", () => {
    const size = 5
    const generator = sized(size)
    const result = generator.range({ seed: 0, size: 10 })
    expect(result).toSatisfyAll((value) => 0 <= value && value <= size)
  })

  it("should generate a range of values between 0 and the max size with distribution", () => {
    const size = 5
    const generator = sized(size, [0.1, 0.15, 0.2, 0.25, 0.3])
    const result = generator.range({ seed: 0, size: 10 })
    expect(result).toSatisfyAll((value) => 0 <= value && value <= size)
  })

  it("should generate the most occurences of a number with the highest distribution", () => {
    const size = 3
    const generator = sized(size, [0.1, 0.2, 0.7])
    const result = generator.range({ seed: 0, size: 100 })

    const counts = result.reduce(
      (accu, curr) => {
        accu[curr] += 1
        return accu
      },
      Array.from(new Array(size)).map(() => 0)
    )

    expect(counts[2]).toBeGreaterThan(counts[1])
    expect(counts[2]).toBeGreaterThan(counts[0])
  })
})
