import { boolean } from "./boolean"
import { Gen } from "./class"
import { of } from "./of"

/**
 * @summary Allows the value of a generator to be `null`
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.nullable(gen.of(1))
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = 1
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function nullable<A>(gen: Gen<A>): Gen<A | null> {
  const none = of(null)
  return boolean.chain((boolean) => (boolean ? gen : none))
}
