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
    const generator = sized(size, [0.1, 0.15, 0.2, 0.25, 0.3])
    const result = generator.range({ state: { seed: 0 }, size: 10 })
    expect(result).toSatisfyAll((value) => 0 <= value && value <= size)
  })
})
