import { Gen } from "./class"

/**
 * @summary Generates a tuple containing each generator's value.
 * @category Combinator
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.required({
 *   first: gen.number(),
 *   second: gen.char(),
 *   third: gen.string({ max: 20 }))
 * })
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = {
 *   first: -1579057621,
 *   second: 'w',
 *   third: 'lm88RW:\\)RNhk(uDIr'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function required<T extends Record<string, unknown>>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<T> {
  return new Gen((state1) => {
    const result = {} as T
    let value1

    for (const property of Object.keys(gens) as Array<keyof T>) {
      const gen = gens[property]
      ;[value1, state1] = gen.stateful(state1)
      result[property] = value1
    }

    return [result as never, state1]
  })
}
