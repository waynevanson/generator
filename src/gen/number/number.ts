import { Gen } from "../class"
import { stated } from "../functions"
import { createPositiveScaler, createScaler } from "./util"

/**
 * @summary Generates a number betwwen 0 and 1.
 * @category Instance
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const result = gen.decimal.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 0.3161734988252105
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export const decimal = stated.map(({ seed, lcg }) => seed / (lcg.m - 1))

function biasByMix(
  value: number,
  { bias, mix }: Record<"bias" | "mix", number>
): number {
  return value * (1 - mix) + bias * mix
}

export interface PositiveOptions
  extends PositiveOptionsDefaults,
    PositiveOptionsPartial {}

export interface PositiveOptionsDefaults {
  /**
   * @default 0
   */
  min?: number
  /**
   * @default 4294967296
   */
  max?: number
  /**
   * @summary Skips validation check for options.
   * @remarks
   * Useful for increased performance when created inside of another generator.
   * @default false
   */
  unchecked?: boolean
}

export interface PositiveOptionsPartial {
  /**
   * @default undefined
   */
  bias?: number
  /**
   * @default undefined
   */
  influence?: number
}

type PositiveOptionsVerified = Required<PositiveOptionsDefaults> &
  PositiveOptionsPartial

/** @internal */
export function verifyPositiveArguments(
  options?: PositiveOptions
): PositiveOptionsVerified {
  const {
    min = 0,
    max = 2 ** 32,
    unchecked = false,
    bias,
    influence,
  } = options ?? {}

  if (!unchecked) {
    if (min < 0)
      throw new Error(`Minimum value of ${min} should not be less than 0`)
    if (max < 0)
      throw new Error(`Maximum value of ${max} should not be less than 0`)
    if (max < min)
      throw new Error(
        `Maximum value of ${max} should be equal to or greater than the minimum value of ${min}`
      )

    if (bias !== undefined) {
      if (bias < min)
        throw new Error(
          `Bias of ${bias} should not be less than the minimum value of ${min}`
        )
      if (bias > max)
        throw new Error(
          `Bias of ${bias} should not be greater than the maximum value of ${max}`
        )
      if (influence === undefined)
        throw new Error(
          `Influence should not be defined (${influence}) when the bias is not defined`
        )
    }

    if (influence !== undefined) {
      if (influence < 0)
        throw new Error(`Influence of ${influence} should not be less than 0`)
      if (influence > 1)
        throw new Error(
          `Influence of ${influence} should not be greater that 1`
        )
      if (bias === undefined)
        throw new Error(
          `Bias should not be defined (${bias}) when the influence is not defined`
        )
    }
  }

  return {
    max,
    min,
    unchecked,
    bias,
    influence,
  }
}

export function positive(options?: PositiveOptions): Gen<number> {
  const { max, min, bias, influence } = verifyPositiveArguments(options)

  const target = { min, max }
  return stated
    .doApply(
      "mix",
      decimal.map((decimal) => decimal * (influence ?? 1))
    )
    .map(({ seed, lcg, mix }) => {
      const source = { min: 0, max: lcg.m - 1 }
      const scaler = createPositiveScaler(source, target)
      const unbiased = scaler(seed)
      return influence != null
        ? biasByMix(unbiased, { bias: bias ?? 0, mix })
        : unbiased
    })
}

// todo - add more
export function negative({
  min = -(2 ** 32),
  max = 0,
  bias = -0,
  influence = 0,
  unchecked = false,
} = {}): Gen<number> {
  if (!unchecked) {
    if (min > 0)
      throw new Error(`Minimum value of ${min} should not be greater than 0`)
    if (max > 0)
      throw new Error(`Maximum value of ${max} should not be greater than 0`)
    if (min > max)
      throw new Error(
        `Minimum value of ${min} should be equal to or less than the maximum value of ${max}`
      )
    if (bias < 0) throw new Error(`Bias of ${bias} should not be less than 0`)
    if (bias > 1)
      throw new Error(`Bias of ${bias} should not be greater that 1`)
    if (influence < 0)
      throw new Error(`Influence of ${influence} should not be less than 0`)
    if (influence > 1)
      throw new Error(`Influence of ${influence} should not be greater that 1`)
  }

  return positive({
    min: max,
    max: -min,
    bias: -bias,
    influence,
    unchecked,
  }).map((positive) => -positive)
}

export interface NumberOptions {
  /**
   * @summary The smallest number that can be generated.
   * @default -4294967296 (2**-32)
   */
  min?: number
  /**
   * @summary The largest number that can be generated.
   * @default 4294967296 (2**32)
   */
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
// https://stackoverflow.com/questions/29325069/how-to-generate-random-numbers-biased-towards-one-value-in-a-range
export function number({
  min = -(2 ** 32),
  max = 2 ** 32,
}: NumberOptions = {}): Gen<number> {
  const target = { min, max }
  return stated.map(({ seed, lcg }) => {
    const source = { min: 0, max: lcg.m - 1 }
    const scaler = createScaler(source, target)
    const unrounded = scaler(seed)
    return Math.round(unrounded)
  })
}
