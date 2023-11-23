import { of, union } from "."
import { Gen } from "./class"
import { seeded } from "./seeded"

export function createDistribution<P extends string>(
  properties: Array<P>,
): Record<P, number> {
  const result = {} as Record<P, number>
  for (const property of properties) {
    result[property] = 0.5
  }

  return result
}

const OMIT = Symbol("OMIT")

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
export function partial<T extends Record<string, unknown>>(
  gens: {
    [P in keyof T]: Gen<T[P]>
  },
  distributions: Partial<Record<keyof T & string, number>> = {},
): Gen<Partial<T>> {
  const prop = (gen: Gen<unknown>, weight: number) =>
    union([of(OMIT), gen] as const, [1 - weight, weight])

  return new Gen((seed) => {
    let value: unknown

    const result = {} as Partial<T>
    for (const property of Object.keys(gens) as Array<keyof T>) {
      const gen = gens[property]!
      const distribution = distributions[property as never] ?? 0.5
      ;[value, seed] = prop(gen, distribution).stateful(seed)
      if (value === OMIT) continue
      else result[property] = value as never
    }
    return [result, seed]
  })
}
