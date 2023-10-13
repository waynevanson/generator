interface Range extends Record<"min" | "max", number> {}

export function clamp(number: number, { min, max }: Range): number {
  return number >= max ? max : number <= min ? min : number
}

/**
 * @param source
 * The min and max inclusive range of the source number that is greater than or
 * equal to 0.
 * @param target
 * The min and max inclusive range of the source number that is greater than or
 * equal to 0.
 * @returns
 */
export function createPositiveScaler(
  source: Range,
  target: Range
): (number: number) => number {
  const top = target.max - target.min
  const bot = source.max - source.min
  return (value) => top * ((value - source.min) / bot) + target.min
}

/**
 * @param source
 * The min and max inclusive range of the source number.
 * @param target
 * The min and max inclusive range of the source number.
 * @returns
 */
export function createScaler(
  source: Range,
  target: Range
): (number: number) => number {
  const { min, max } = target
  const upper = {
    min: clamp(min, { min: 0, max }),
    max: clamp(max, { min: 0, max }),
  }
  const lower = {
    min: -clamp(min, { min, max: 0 }),
    max: -clamp(max, { min, max: 0 }),
  }

  const createPositive = createPositiveScaler(source, upper)
  const createNegative = createPositiveScaler(source, lower)

  return (value) => createPositive(value) - createNegative(value)
}
