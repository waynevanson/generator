import { Gen } from "./class"
import { decimal } from "./decimal"
import { stated } from "./stated"
import { biasByMix, createPositiveScaler } from "./util"

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
