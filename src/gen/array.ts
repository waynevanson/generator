import { Gen } from "./class"
import { positive } from "./positive"
import { vector } from "./vector"

export interface ArrayOptions {
  min?: number
  max?: number
  bias?: number
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
  { min = 0, max = 50, bias, influence }: ArrayOptions = {}
): Gen<Array<A>> {
  return positive({ min, max, bias, influence }).chain((size) =>
    vector(gen, Math.round(size))
  )
}
