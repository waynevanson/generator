import { M_MODULUS } from "../lcg"
import { Gen } from "./class"
import { seeded } from "./seeded"
import { createScaler } from "./util"

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
 * const expected = 404
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
// https://stackoverflow.com/questions/29325069/how-to-generate-random-numbers-biased-towards-one-value-in-a-range
export function number({
  min = -(2 ** 32),
  max = 2 ** 32,
}: NumberOptions = {}): Gen<number> {
  const target = { min, max }
  const source = { min: 0, max: M_MODULUS - 1 }
  return seeded.map((seed) => {
    const scaler = createScaler(source, target)
    return scaler(seed)
  })
}
