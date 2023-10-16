import { Gen } from "./class"
import { sized } from "./sized"

/**
 * @summary
 * Creates a generator will return one of the constants provided.
 *
 * @category Constructor
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.constants(["hello", "world"])
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = "hello"
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function constants<T extends readonly [unknown, ...Array<unknown>]>(
  values: T
): Gen<T[number]> {
  return sized(values.length).map((index) => values[index])
}
