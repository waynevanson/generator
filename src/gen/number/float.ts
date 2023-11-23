import { Gen, decimal, integer, tuple } from ".."

export interface FloatOptions {
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

export function float({
  influence = 0,
  max = 2 ** 32,
  min = -(2 ** 32),
  target = (max - min) / 2,
}: FloatOptions): Gen<number> {
  return tuple([integer({ influence, max, min, target }), decimal]).map(
    ([integer, decimal]) => {
      const float = integer + decimal
      return float > max ? float - 1 : float
    },
  )
}
