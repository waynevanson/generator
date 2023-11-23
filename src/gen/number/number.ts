import { decimal, integer, tuple } from ".."
import { SEED_MAX } from "../../lcg"
import { Gen } from "../class"

export interface NumberOptions {
  /**
   * @summary The smallest number that can be generated.
   * @default -4294967296 (2**-32)
   */
  min?: number
  /**
   * @summary The largest number that can be generated.
   * @default 4294967296 (2**32)
   */
  max?: number
}

/**
 * @summary Generates a number within a range
 * @category Constructor
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.number({ min: -57, max: 1400})
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 404.345354328
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function number({
  min = -SEED_MAX,
  max = SEED_MAX,
}: NumberOptions = {}): Gen<number> {
  return tuple([integer({ min, max }), decimal]).map(
    ([integer, decimal]) => integer + decimal,
  )
}
