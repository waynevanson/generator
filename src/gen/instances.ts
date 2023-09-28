import { Gen } from "./class"

/**
 * @summary Creates a generator that uses the incoming seed as the value.
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
export const seeded = new Gen((state) => [state.seed, state]).increment()

/**
 * @summary Creates a generator that uses the state as the value.
 * @category Instance
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const state = { seed: 0, lcg: gen.lcg }
 * const generator = gen.stated
 * const result = generator.run(state)
 *
 * assert.deepStrictEqual(result, state)
 * ```
 */
export const stated = new Gen((state) => [state, state]).increment()
