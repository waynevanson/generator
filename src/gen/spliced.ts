import { Gen } from "./class"
import { integer } from "./number/integer"

/**
 * @summary
 * Creates a generator from an array and returns an array with some elements removed.
 *
 * @param distribution
 * A decimal percentage value that indicates how many elements to keep on average compared to
 */
export function spliced<A>(
  values: ReadonlyArray<A>,
  distribution: number = 0.5,
): Gen<ReadonlyArray<A>> {
  const decimal = values.length - distribution * values.length

  const min = Math.floor(decimal)
  const max = Math.ceil(decimal)

  const size = integer({ min, max })
  const indice = integer({ min: 0, max })

  // todo - abstract this reducer like pattern because it keeps happening.
  const indicies = (size: number): Gen<Array<number>> =>
    new Gen((seed) => {
      const result = [] as Array<number>
      let index: number
      while (result.length < size) {
        ;[index, seed] = indice
          .filter((index) => !result.includes(index))
          .stateful(seed)

        result.push(index)
      }

      return [result, seed]
    })

  return size
    .chain(indicies)
    .map((indicies) => indicies.sort().map((index) => values[index]!))
}
