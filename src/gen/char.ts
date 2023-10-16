// https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
// todo - make it work with min-max===0 (neg numbers)
// or use lcg as limit
// gen positive,
// gen negative

import { number } from "./number"

export interface CharOptions {
  from?: string
  to?: string
}

/**
 * @summary Generates a number within a range
 * @category Constructor
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.char({ from: 'a', to: 'z' })
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 'i'
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function char({ from = " ", to = "~" }: CharOptions = {}) {
  return number({ min: from.charCodeAt(0), max: to.charCodeAt(0) }).map(
    (number) => String.fromCharCode(number)
  )
}
