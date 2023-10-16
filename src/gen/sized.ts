import { of } from "./of"
import { seeded } from "./seeded"
import { Gen } from "./class"
import { boolean } from "./boolean"

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
export function sized(max: number): Gen<number> {
  if (max < 2) return of(0)
  else if (max == 2) return boolean.map((boolean) => (boolean ? 1 : 0))
  else return seeded.map((seed) => seed % max)
}
