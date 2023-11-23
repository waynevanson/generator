import { integer } from "."
import { Gen } from "./class"
import { vector } from "./vector"

export interface ArrayOptions {
  min?: number
  max?: number
  target?: number
  influence?: number
}

/**
 * @summary Returns an array of a fixed size with data from the generator.
 * @categoy Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.array(gen.sized(10), { min: 3, max:4})
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = [2, 7, 4]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function array<A>(
  gen: Gen<A>,
  { min = 0, max = 50, target = 0, influence = 0 }: ArrayOptions = {},
): Gen<Array<A>> {
  return integer({ min, max, target, influence }).chain((size) =>
    vector(gen, size),
  )
}
