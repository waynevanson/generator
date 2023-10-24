import { Gen } from "./class"

export function expand<A, B>(
  gen: Gen<A>,
  reducer: (accumulator: B, current: A, index: number) => readonly [B, boolean],
  initial: B,
): Gen<B> {
  return new Gen((seed) => {
    let accumulator: B = initial
    let current: A
    let index = 0
    let done = false

    while (!done) {
      ;[current, seed] = gen.stateful(seed)
      ;[accumulator, done] = reducer(accumulator, current, index)
      index++
    }

    return [accumulator, seed]
  })
}
