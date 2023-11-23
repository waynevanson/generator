import { SEED_MAX, SEED_MIN } from "../../lcg"
import { Gen } from "../class"
import { uniform } from "./uniform"
import { tuple } from "../tuple"
import { clamp } from "../util"
import { decimal } from "./decimal"
import { of } from "../of"

/**
 * @summary
 * Generates a number between a min and a max, where both `min` and `max`
 * are non-negative.
 */
function positive(range: Record<"min" | "max", number>): Gen<number> {
  const diff = range.max - range.min
  if (diff < 0)
    throw new Error(
      `calculated difference should be greater than 0, but received ${diff}`,
    )

  if (diff === 0) return of(range.min)

  // sized can't take huge values because of how the distribution is calculated.
  return uniform(diff).map((number) => number + range.min)
}

type BiasOptions = {
  min: number
  max: number
  target: number
  influence: number
}

export interface IntegerOptions {
  /**
   * @default -(2**32)
   */
  min?: number
  /**
   * @default 2**32 - 1
   */
  max?: number
  /**
   * @summary
   * A number within the range where more occurences of numbers are generated.
   * @default (max - min) / 2
   */
  target?: number
  /**
   * @default 0
   */
  influence?: number
}

function createBias(options: BiasOptions): (x: number) => Gen<number> {
  return (number) =>
    decimal.map((decimal) =>
      decimal < 1 / 3
        ? number
        : (1 - options.influence) * (number - options.target) + options.target,
    )
}

const SEED_RANGE = { min: SEED_MIN, max: SEED_MAX }

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
  min = -(2 ** 32),
  max = 2 ** 32,
  target = (max - min) / 2,
  influence = 0,
}: IntegerOptions = {}): Gen<number> {
  const top = positive({
    min: clamp(min, SEED_RANGE),
    max: clamp(max, SEED_RANGE),
  })

  const bot = positive({
    min: clamp(-max, SEED_RANGE),
    max: clamp(-min, SEED_RANGE),
  })

  const bias = createBias({ min, max, target, influence })

  return tuple([top, bot])
    .map(([top, bot]) => clamp(top - bot, { min, max }))
    .chain(bias)
}
