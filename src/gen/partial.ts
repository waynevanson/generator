import { boolean } from "./boolean"
import { Gen } from "./class"

/**
 * @summary
 * Generates an object containing each generator's value with fixed keys
 * that may be present.
 *
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.partial({
 *   first: gen.number(),
 *   second: gen.char(),
 *   third: gen.string({ max: 20 }))
 * })
 * const result = generator.run({ seed: 2978653158, lcg: gen.lcg})
 * const expected = {
 *   first: -25570277,
 *   second: 'R',
 *   third: 'gL1>*mKFi0j>c5:r'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function partial<T extends Record<string, unknown>>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<Partial<T>> {
  return new Gen((state) => {
    const gensByProperty = Object.keys(gens) as Array<keyof T>
    const result = {} as Partial<T>
    let value
    let skip
    for (const property of gensByProperty) {
      ;[skip, state] = boolean.stateful(state)
      if (skip) continue
      const gen = gens[property]
      ;[value, state] = gen.stateful(state)
      result[property] = value
    }
    return [result, state]
  })
}
