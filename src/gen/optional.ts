import { boolean } from "./boolean"
import { Gen } from "./class"
import { constants } from "./constants"

/**
 * @summary Allows the value of a generator to be `null` or `undefined`
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.optional(gen.of(3))
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = 3
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function optional<A>(gen: Gen<A>): Gen<A | null | undefined> {
  const none = constants([undefined, null])
  return boolean.chain((boolean) => (boolean ? gen : none))
}
