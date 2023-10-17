import { M_MODULUS } from ".."
import { stated } from "./stated"

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
 * const generator = gen.boolean
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = true
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export const boolean = stated.map(({ seed }) => seed < M_MODULUS / 2)
