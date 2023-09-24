import { Lcg } from "./lcg.js"

/**
 * @summary The internal state used by
 */
export interface State {
  /**
   * @summary The seed used for generating data.
   */
  seed: number

  /**
   * @summary A linear congruent generator used to increment the seed.
   */
  lcg: Lcg
}

/**
 * @summary
 * Generator that holds the computation for generating values and the
 * {@link State | internal state} for incrementing the seed.
 */
export class Gen<A> {
  constructor(public stateful: (state: State) => [A, State]) {}

  /**
   * @summary Runs the generator and returns the resulting value.
   * @category Destructor
   */
  run(state: State): A {
    return this.stateful(state)[0]
  }

  /**
   * @summary Runs
   * @category Combinator
   */
  modify(f: (state: State) => State): Gen<A> {
    return new Gen((state1) => {
      const [value1, state2] = this.stateful(state1)
      return [value1, f(state2)]
    })
  }

  /**
   * @summary Increments the seed within the state using the {@link Lcg | linear congruent generator}
   * @category Combinator
   */
  increment(): Gen<A> {
    return this.modify(({ lcg, seed }) => ({ lcg, seed: lcg.increment(seed) }))
  }
}

/**
 * @summary Creates a generator where the vaue is of type A.
 * @category Constructor
 *
 * @example
 * ```js
 * import * as gen from "chansheng"
 * import * as assert from "node:assert"
 *
 * const value = 2
 * const generator = gen.of(value)
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 *
 * assert.deepStrictEqual(result, value)
 * ```
 */
export function of<A>(value: A): Gen<A> {
  return new Gen((state) => [value, state])
}

/**
 * @summary
 * Creates a generator that has no value,
 * useful mostly for changing the state then applying it with another generator.
 * @category Instance
 */
export const empty = of(undefined as never)

/**
 * @summary Creates a generator that uses the incoming seed as the value.
 * @category Instance
 */
export const seeded = new Gen((state) => [state.seed, state])
