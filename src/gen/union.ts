import { Gen } from "./class"
import { sized } from "./sized"

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
  distribution?: { [P in keyof T]: number }
): Gen<T[number]> {
  return sized(gens.length, distribution).chain((index) => gens[index])
}
