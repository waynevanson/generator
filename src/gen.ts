import { Lcg } from "./lcg.js"

/**
 * @summary The internal state used by a {@link Gen | generator}.
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
 * 
 * @category Class

 * @remarks
 * A generator is lazy: it will only run when `Gen.run` is called with the state.
 * To compose the generator's data without consuming it, consider using the combinators.
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
   * @summary Modifies the state of the generate without modifying the value.
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

  /**
   * @summary Apply a function to the value inside of a generator.
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "chansheng"
   * import * as assert from "assert"
   *
   * const value = 8
   * const doubler = (number: number) => number * 2
   * const generator = gen.of(value).map(doubler)
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = 16
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  map<B>(f: (value: A) => B): Gen<B> {
    return new Gen((state1) => {
      const [value1, state2] = this.stateful(state1)
      const value2 = f(value1)
      return [value2, state2]
    })
  }

  /**
   * @summary Apply a function inside of a generator to the supplied value.
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "chansheng"
   * import * as assert from "assert"
   *
   * const value = 8
   * const doubler = (number: number) => number * 2
   * const generator = gen.of(doubler).flap(value)
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = 16
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  flap<R, B>(this: Gen<Extract<A, (parameter: R) => B>>, parameter: R): Gen<B> {
    return this.map((f) => f(parameter))
  }

  /**
   * @summary
   * Applies the function within `this` generator to the value within
   * the generator provided.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "chansheng"
   * import * as assert from "assert"
   *
   * const value = 8
   * const doubler = (number: number) => number * 2
   * const generator = gen.of(doubler).apply(gen.of(value))
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = 16
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  apply<R, B>(this: Gen<Extract<A, (parameter: R) => B>>, gen: Gen<R>): Gen<B> {
    return new Gen((state1) => {
      const [value1, state2] = this.stateful(state1)
      const [value2, state3] = gen.stateful(state2)
      const value3 = value1(value2)
      return [value3, state3]
    })
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
