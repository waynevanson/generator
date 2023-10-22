import { seeded } from "./seeded"
import { Gen } from "./class"
import { M_MODULUS } from "../lcg"

export type Distribution = ReadonlyArray<number>

// todo - instead of finding at index, lets allow multiple numbers
// to get the
export function createDistribution(max: number): Distribution {
  const average = 1 / max
  const distribution = Array.from(new Array(max)).map(() => average)
  const summish = distribution
    .slice(0, -1)
    .reduce((first, second) => first + second, 0)
  const last = 1 - summish
  distribution[distribution.length - 1] = last

  return distribution
}

export function accumulate<A>(
  inputs: ReadonlyArray<A>,
  f: (previous: A, current: A) => A
): ReadonlyArray<A> {
  return inputs.reduce((accumulator, current, index) => {
    if (index === 0) accumulator.push(current)
    else accumulator.push(f(accumulator[index - 1], current))
    return accumulator
  }, [] as Array<A>)
}

export function createValidators(
  distribution: Distribution
): ReadonlyArray<(seed: number) => boolean> {
  return accumulate(
    distribution,
    (previous, current) => previous + current
  ).map((upper, index, array) => {
    const lower = index === 0 ? 0 : array[index - 1]
    return (value: number) => lower <= value && value <= upper
  })
}

class Cache<K, V> {
  constructor(private store = new Map<K, V>()) {}

  get(key: K, value: () => V): V {
    if (!this.store.has(key)) {
      this.store.set(key, value())
    }
    return this.store.get(key)!
  }
}

// creating distributions can be expensive.
// if the library generates a default distribution,
// caching it for large numbers may increase performance in large codebases
// and in chained generators.
const cache = new Cache<number, ReadonlyArray<number>>()

/**
 * @summary
 * Creates a generator that contains `max` amount of values
 * between `0` and `max - 1`.
 *
 * @category Constructor
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.sized(10)
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = 0
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function sized(
  max: number,
  distribution: ReadonlyArray<number> = cache.get(max, () =>
    createDistribution(max)
  )
): Gen<number> {
  if (max < 1)
    throw new Error("Sized generator must have a max number greater than 1.")

  if (distribution.length != max)
    throw new Error(
      `The number of elements in a distribution (${distribution.length})` +
        `must be equal to the length of the max value (${max}).`
    )

  const sum = distribution.reduce((prev, curr) => prev + curr)

  if (sum !== 1)
    throw new Error(
      `The sum of a distribution should be equal to 1, but received ${sum}. ` +
        `The distribution is:\n` +
        JSON.stringify(distribution, null, 2)
    )

  const validators = createValidators(distribution)

  return seeded.map((seed) => {
    const decimal = seed / (M_MODULUS - 1)
    const index = validators.findIndex((checker) => checker(decimal))

    /* istanbul ignore next */
    if (index < 0)
      throw new Error(
        `Index should be greater than or equal to zero, but received ${index}. ` +
          "This is a bug, please report it for the good of the people."
      )

    return index
  })
}
