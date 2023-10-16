import { Gen } from "./class"

/**
 * @summary Returns an array of a fixed size with data from the generator.
 * @categoy Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.vector(gen.sized(10), 4)
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = [0, 3, 2, 7]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function vector<A>(gen: Gen<A>, size: number): Gen<Array<A>> {
  return new Gen((state1) => {
    const result: Array<A> = []
    let value1
    for (const _ of new Array(size)) {
      ;[value1, state1] = gen.stateful(state1)
      result.push(value1)
    }
    return [result, state1]
  })
}
