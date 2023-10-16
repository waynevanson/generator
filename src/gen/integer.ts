import { Gen } from "./class"
import { number } from "./number"

/**
 * @summary Generates whole numbers between two values
 */
export function integer({ min = -(2 ** 32), max = 2 ** 32 } = {}): Gen<number> {
  return number({ min, max }).map(Math.round)
}
