import { Gen } from "./class"

/**
 * @summary
 * Transforms an array of generators into a generator that contains an array.
 *
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const gens = [gen.char(), gen.number()]
 * const generator = gen.sequence(gens)
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = ['a', -28899327]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function sequence<T>(gens: Array<Gen<T>>): Gen<Array<T>> {
  return new Gen((state) => {
    const results: Array<T> = []
    let value: T
    for (const gen of gens) {
      ;[value, state] = gen.stateful(state)
      results.push(value)
    }
    return [results, state]
  })
}
