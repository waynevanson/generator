import { array } from "./array"
import { CharOptions, char } from "./char"
import { Gen } from "./class"
import { NumberOptions } from "./number"

export interface StringOptions extends CharOptions, NumberOptions {}

/**
 * @summary Generates a number within a range
 * @category Constructor
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.string({ from: 'a', to: 'z', min: 1, max: 10 })
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 'xeuu'
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function string({
  from = " ",
  to = "~",
  min = 0,
  max = 100,
}: StringOptions = {}): Gen<string> {
  return array(char({ from, to }), { min, max }).map((chars) => chars.join(""))
}
