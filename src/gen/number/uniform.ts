import { seeded } from "../seeded"
import { Gen } from "../class"
import { SEED_MAX } from "../../lcg"

/**
 * @summary
 * Creates a generator that returns a whole number between
 * `0` and `max`.
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
export function uniform(max: number): Gen<number> {
  if (max < 1)
    throw new Error("Sized generator must have a max number greater than 1.")

  // (m) => ((m - SEED_MIN) / (SEED_MAX - SEED_MIN)) * (max - 0) + 0,
  return seeded.map((m) => Math.floor((m / SEED_MAX) * max))
}
