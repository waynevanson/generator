import { seeded } from "./seeded"
import { SEED_MAX, SEED_MIN } from "../lcg"
import { Gen } from "./class"
import { sized } from "./sized"
import { tuple } from "./tuple"
import { clamp } from "./util"

function positive(range: Record<"min" | "max", number>): Gen<number> {
  const diff = range.max - range.min
  // sized can't take huge values because of how the distribution is calculated.
  if (diff <= 10_000) return sized(diff + 1).map((number) => number + range.min)
  else return seeded.map((seed) => seed % SEED_MAX)
}

// bias and influence.
export interface IntegerOptions {
  min?: number
  max?: number
}

/**
 * @summary Generates a number within a range
 * @category Constructor
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.number({ min: -57, max: 1400})
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 404
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function integer({
  min = -SEED_MAX,
  max = SEED_MAX,
}: IntegerOptions = {}): Gen<number> {
  const SEED_RANGE = { min: SEED_MIN, max: SEED_MAX }

  const top = positive({
    min: clamp(min, SEED_RANGE),
    max: clamp(max, SEED_RANGE),
  })

  const bot = positive({
    min: clamp(-max, SEED_RANGE),
    max: clamp(-min, SEED_RANGE),
  })

  return tuple([top, bot]).map(([top, bot]) => top - bot)
}
