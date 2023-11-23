import { IntegerOptions } from "./number"
import { array } from "./array"
import { Gen } from "./class"
import { tuple } from "./tuple"

/**
 * @summary Generates an object containing each generator's value with fixed keys.
 * @category Combinator
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.record(gen.char() ,gen.string({ max: 20}), { min:4, max: 8})
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = {
 *    '!': '6(A',
 *   W: ')RNhk(',
 *   s: 'H%`/Z\\)',
 *   u: 'rGL|=`D9',
 *   v: 'm88R'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function record<K extends string, A>(
  property: Gen<K>,
  value: Gen<A>,
  options: IntegerOptions = { min: 0, max: 100 },
): Gen<Record<K, A>> {
  return array(tuple([property, value] as const), options).map((entries) =>
    entries.reduce(
      (result, [property, value]) => {
        result[property] = value
        return result
      },
      {} as Record<K, A>,
    ),
  )
}
