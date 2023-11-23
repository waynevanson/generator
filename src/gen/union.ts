import { of } from "."
import { Gen } from "./class"
import { index } from "./number/index_"

/**
 * @summary
 * Creates a generator that uses one of the provided generators for
 * generating the value.
 *
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const first = gen.required({
 *   one: gen.number()
 * })
 * const second = gen.required({
 *   two: gen.char()
 * })
 * const generator = gen.union([first, second])
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = {
 *  two: 'O'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function union<T extends ReadonlyArray<unknown>>(
  gens: {
    [P in keyof T]: Gen<T[P]>
  },
  distribution = gens.map(() => 1 / gens.length) as { [P in keyof T]: number },
): Gen<T[number]> {
  if (gens.length <= 0) return of([])
  const distributed = distribution?.reduce(
    (accu, curr, index) => {
      accu[index + 1] = curr
      return accu
    },
    {} as Record<number, number>,
  )

  // console.log({ distribution, distributed })

  return index(gens.length, distributed).chain((index) => {
    const valued = gens[index]
    // console.log({ valued, index })
    return valued
  })
}
