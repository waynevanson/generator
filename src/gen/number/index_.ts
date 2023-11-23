import { createLinearScaler } from ".."
import { Gen } from "../class"
import { decimal } from "./decimal"

/**
 * @summary
 * Generates a whole number between 0 and one below the size.
 *
 * @param size a whole number that is greater than or equal to 0.
 */
export function index(
  size: number,
  distribution: Record<number, number> = { [size]: 1 },
): Gen<number> {
  if (size <= 0)
    throw new Error(`length should be greater than 0, but received ${size}`)

  // transform they key from range [0, max] to [0, 1]
  const probabilityByPercentile = Object.keys(distribution)
    .map((key) => Number(key))
    .reduce(
      (accu, key) => {
        const percentile = key / size
        const probability = distribution[key]
        accu[percentile] = probability
        return accu
      },
      {} as Record<number, number>,
    )

  const lookupper = lookup(probabilityByPercentile)

  return decimal.map(lookupper)
}

/**
 *
 * @param percentage A number with decimals between inclusive between 0 and 1.
 * @param distribution A record where keys are a percentage and the value is the probability.
 */
function lookup<K extends number>(distribution: Record<K, number>) {
  const steps = Object.keys(distribution)
    .map((string) => Number(string))
    .sort() as Array<K>

  // round up input to next value
  const toStep = (x: number) =>
    steps.reduce((accu, curr) =>
      Math.abs(x - curr) < Math.abs(x - accu) ? curr : accu,
    )

  const sourcesBySteps = steps.reduce(
    (accu, curr, index, steps) => {
      // function that scales in the range
      accu[curr] = { min: index <= 0 ? 0 : steps[index - 1], max: curr }

      return accu
    },
    {} as Record<K, Record<"min" | "max", number>>,
  )

  const target = { min: 0, max: 1 }

  return (percentage: number) => {
    const step = toStep(percentage)
    const source = sourcesBySteps[step]
    const scaler = createLinearScaler({ source, target })
    const number = scaler(percentage)
    const rounded = Math.round(number)
    // console.log({
    //   distribution,
    //   steps,
    //   sourcesBySteps,
    //   percentage,
    //   step,
    //   source,
    //   number,
    //   rounded,
    // })

    return rounded
  }
}
