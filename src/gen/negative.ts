import { Gen } from "./class"
import { positive } from "./positive"

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
