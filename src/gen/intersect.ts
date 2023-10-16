import { Gen } from "./class"

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

/**
 * @summary
 * Merges the keys and values of two objects.
 *
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const first = gen.required({
 *   one: gen.number()
 * })
 * const second = gen.required({
 *   two: gen.char()
 * })
 * const generator = gen.intersect([first, second])
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = {
 *   one: 1662339019,
 *   two: 'O'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function intersect<T extends ReadonlyArray<unknown>>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<UnionToIntersection<T[number]>> {
  return new Gen((state) => {
    let value
    const result = {}
    for (const gen of gens) {
      ;[value, state] = gen.stateful(state)
      Object.assign(result, value)
    }
    return [result as never, state]
  })
}
