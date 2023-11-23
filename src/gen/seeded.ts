import { increment } from "../lcg"
import { Gen } from "./class"

/**
 * @summary
 * Creates a generator that consumes the incoming seed returns it as the value, and incrementing the internal seed.
 * @category Instance
 *
 * @example
 * ```js
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const seed = 0
 * const generator = gen.seeded
 * const result = generator.run({ seed, lcg: gen.lcg})
 *
 * assert.deepStrictEqual(result, seed)
 * ```
 */
export const seeded = new Gen((seed) => [seed, seed]).modify(increment)
