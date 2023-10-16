import { Gen } from "./class"

/**
 * @summary Generates a tuple containing each generator's value.
 * @category Combinator
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.tuple([gen.number(), gen.char(), gen.string({ max: 20 })] as const)
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = [
 *   -1579057621,
 *   'w',
 *   'lm88RW:\\)RNhk(uDIr'
 * ]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function tuple<T extends readonly [unknown, ...Array<unknown>]>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<T> {
  return new Gen((state1) => {
    const result = []
    let value1

    for (const gen of gens) {
      ;[value1, state1] = gen.stateful(state1)
      result.push(value1)
    }

    return [result as never, state1]
  })
}
