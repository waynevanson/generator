import { Lcg } from "../lcg"

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
   * import * as gen from "@waynevanson/generator"
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
   * import * as gen from "@waynevanson/generator"
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
   * the generator provided, whilst letting the generators transform the state.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
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

  /**
   * @summary
   * Applies the effects of `apply`, returning the first generator's value.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "assert"
   *
   * const a = 2
   * const b = 8
   * const first = gen.of(a)
   * const second = gen.of(b)
   * const generator = first.applyFirst(second)
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = a
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  applyFirst<B>(gen: Gen<B>): Gen<A> {
    return this.map((a) => () => a).apply(gen)
  }

  /**
   * @summary
   * Applies the effects of `apply`, returning the second generator's value.
   *
   * @category Combinator
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "assert"
   *
   * const a = 2
   * const b = 8
   * const first = gen.of(a)
   * const second = gen.of(b)
   * const generator = first.applySecond(second)
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = b
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  applySecond<B>(gen: Gen<B>): Gen<B> {
    return this.map((_) => (b: B) => b).apply(gen)
  }

  /**
   * @summary
   * Uses the the current value inside of a generator to create a new generator,
   * returning the new generators result.
   *
   * @category Combinator
   
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "assert"
   *
   * const value = 2
   * const generator = gen.of(value).chain(number => gen.of(number * 8))
   * const result = generator.run({ seed: 0, lcg: gen.lcg })
   * const expected = 16
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  chain<B>(f: (value: A) => Gen<B>): Gen<B> {
    return new Gen((state1) => {
      const [value1, state2] = this.stateful(state1)
      return f(value1).stateful(state2)
    })
  }

  /**
   * @summary
   * Uses the the current value inside of a generator to create a new generator,
   * returning the new generators result.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "assert"
   *
   * const value = 2
   * const generator = gen.of(value).chainFirst(number => gen.of(number * 8))
   * const result = generator.run({ seed: 0, lcg: gen.lcg })
   * const expected = value
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  chainFirst<B>(f: (value: A) => Gen<B>): Gen<A> {
    return this.chain((a) => f(a).map(() => a))
  }

  /**
   * @summary
   * Creates an object within the generator that has the property name provided
   * as a property and the value within the generato as the value.
   * Useful for composing with the `do` syntax provided.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "assert"
   *
   * const value = 2
   * const property = "hello"
   * const generator = gen.of(value).do(property)
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = { [property]: value}
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  do<K extends string>(property: K): Gen<{ [P in K]: A }> {
    return this.map((value) => ({ [property]: value } as never))
  }

  /**
   * @summary
   * Just like `chain` but binds the returning value of the provided generator
   * to the current generator as the property provided.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "assert"
   *
   * const generator = gen.of(2).do("first").doChain("second", ({ first }) => gen.of(8 * first))
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = { first: 2, second: 16}
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  doChain<K extends string, B>(
    property: Exclude<K, keyof A>,
    kleisli: (value: A) => Gen<B>
  ): Gen<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }> {
    return this.chain((a) =>
      kleisli(a).map((b) => Object.assign({}, a, { [property]: b }) as never)
    )
  }

  /**
   * @summary
   * Just like `apply` but binds the returning value of the provided generator
   * to the current generator as the property provided.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "assert"
   *
   * const generator = gen.of(2).do("first").doApply("second", gen.of(8))
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = { first: 2, second: 8}
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  doApply<K extends string, B>(
    property: Exclude<K, keyof A>,
    gen: Gen<B>
  ): Gen<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }> {
    return this.chain((a) =>
      gen.map((b) => Object.assign({}, a, { [property]: b }) as never)
    )
  }

  /**
   * @summary Restricts the value using the filter
   * @remarks
   * If the predicate/refinement always returns false, this generate will loop forever.
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "assert"
   *
   * const generator = gen.sized(10).filter(zeroToNine => zeroToNine > 5)
   * const result = generator.run({ seed: 0, lcg: gen.lcg})
   * const expected = 7
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  filter(predicate: (value: A) => boolean): Gen<A>
  filter<B extends A>(refinement: (value: A) => value is B): Gen<B>
  filter<B extends A>(refinement: (value: A) => value is B): Gen<B> {
    return new Gen((state1) => {
      let value1: A

      while (true) {
        ;[value1, state1] = this.stateful(state1)
        if (refinement(value1)) return [value1, state1]
      }
    })
  }

  /**
   * @summary Generates a list of values from a generator.
   * @category Destructor
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "node:assert"
   *
   * const state = { seed: 1357954837, lcg: gen.lcg}
   * const result = gen.char().range({ state, size: 4}))
   * const expected = [
   *   '>',
   *   'w',
   *   'v',
   *   '1'
   * ]
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  range({ state, size = 10 }: { state: State; size?: number }): Array<A> {
    const result = []
    let value
    for (const _ of new Array(size)) {
      ;[value, state] = this.stateful(state)
      result.push(value)
    }
    return result
  }
}
