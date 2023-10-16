import { boolean } from "./boolean"
import { Gen } from "./class"
import { of } from "./of"

/**
 * @summary Allows the value of a generator to be `undefined`
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.undefinable(gen.of(2))
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = 2
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function undefinable<A>(gen: Gen<A>): Gen<A | undefined> {
  const none = of(undefined)
  return boolean.chain((boolean) => (boolean ? gen : none))
}
