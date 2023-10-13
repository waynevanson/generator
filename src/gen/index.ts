import { Lcg } from "../lcg"
import { createPositiveScaler, createScaler } from "./util"

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

  /**
   * @summary
   * Merges the keys and values of two objects.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "node:assert"
   *
   * const first = gen.required({
   *   one: gen.number()
   * })
   * const second = gen.required({
   *   two: gen.char()
   * })
   * const generator = first.intersect(second)
   * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
   * const expected = {
   *   one: 1662339019,
   *   two: 'O'
   * }
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  intersect<B extends Record<string, unknown>>(
    this: A extends Record<string, unknown> ? Gen<A> : never,
    and: Gen<B>
  ): Gen<A & B> {
    return new Gen((state0) => {
      const [a, state1] = this.stateful(state0)
      const [b, state2] = and.stateful(state1)
      return [Object.assign({}, a, b), state2]
    })
  }

  /**
   * @summary
   * Creates a generator that uses one of the provided generators for
   * generating the value.
   *
   * @category Combinator
   *
   * @example
   * ```ts
   * import * as gen from "@waynevanson/generator"
   * import * as assert from "node:assert"
   *
   * const first = gen.required({
   *   one: gen.number()
   * })
   * const second = gen.required({
   *   two: gen.char()
   * })
   * const generator = first.union(second)
   * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
   * const expected = {
   *  two: 'O'
   * }
   *
   * assert.deepStrictEqual(result, expected)
   * ```
   */
  union<B>(or: Gen<B>): Gen<A | B> {
    return new Gen(({ seed, lcg }) => {
      const boolean = seed < lcg.m / 2
      seed = lcg.increment(seed)
      return boolean
        ? this.stateful({ seed, lcg })
        : (or.stateful({ seed, lcg }) as never)
    })
  }
}
/**
 * @summary Creates a generator that uses the incoming seed as the value.
 * @category Instance
 *
 * @example
 * ```js
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const seed = 0
 * const generator = gen.seeded
 * const result = generator.run({ seed, lcg: gen.lcg})
 *
 * assert.deepStrictEqual(result, seed)
 * ```
 */
export const seeded = new Gen((state) => [state.seed, state]).increment()

/**
 * @summary Creates a generator that uses the state as the value.
 * @category Instance
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const state = { seed: 0, lcg: gen.lcg }
 * const generator = gen.stated
 * const result = generator.run(state)
 *
 * assert.deepStrictEqual(result, state)
 * ```
 */
export const stated = new Gen((state) => [state, state]).increment()

/**
 * @summary Returns an array of a fixed size with data from the generator.
 * @categoy Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.vector(gen.sized(10), 4)
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = [0, 3, 2, 7]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function vector<A>(gen: Gen<A>, size: number): Gen<Array<A>> {
  return new Gen((state1) => {
    const result: Array<A> = []
    let value1
    for (const _ of new Array(size)) {
      ;[value1, state1] = gen.stateful(state1)
      result.push(value1)
    }
    return [result, state1]
  })
}

export interface ArrayOptions {
  min?: number
  max?: number
  bias?: number
  influence?: number
}

/**
 * @summary Returns an array of a fixed size with data from the generator.
 * @categoy Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.array(gen.sized(10), { min: 3, max:4})
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = [2, 7, 4]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function array<A>(
  gen: Gen<A>,
  { min = 0, max = 50, bias, influence }: ArrayOptions = {}
): Gen<Array<A>> {
  return positive({ min, max, bias, influence }).chain((size) =>
    vector(gen, Math.round(size))
  )
}

/**
 * @summary Allows the value of a generator to be `null`
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.nullable(gen.of(1))
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = 1
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function nullable<A>(gen: Gen<A>): Gen<A | null> {
  const none = of(null)
  return boolean.chain((boolean) => (boolean ? gen : none))
}

/**
 * @summary Allows the value of a generator to be `undefined`
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.undefinable(gen.of(2))
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = 2
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function undefinable<A>(gen: Gen<A>): Gen<A | undefined> {
  const none = of(undefined)
  return boolean.chain((boolean) => (boolean ? gen : none))
}

/**
 * @summary Allows the value of a generator to be `null` or `undefined`
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.optional(gen.of(3))
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = 3
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function optional<A>(gen: Gen<A>): Gen<A | null | undefined> {
  const none = constants([undefined, null])
  return boolean.chain((boolean) => (boolean ? gen : none))
}

/**
 * @summary Creates a generator where the vaue is of type A.
 * @category Constructor
 *
 * @example
 * ```js
 * import * as gen from "@waynevanson/generator"
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
 * Creates a generator that contains `max` amount of values
 * between `0` and `max - 1`.
 *
 * @category Constructor
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.sized(10)
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = 0
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function sized(max: number): Gen<number> {
  return seeded.map((number) => number % max)
}

/**
 * @summary
 * Creates a generator that contains `max` amount of values
 * between `0` and `max - 1`.
 *
 * @category Constructor
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.boolean
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = true
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export const boolean = stated.map(({ seed, lcg: { m } }) => seed < m / 2)

/**
 * @summary
 * Creates a generator will return one of the constants provided.
 *
 * @category Constructor
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.constants(["hello", "world"])
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = "hello"
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function constants<T extends readonly [unknown, ...Array<unknown>]>(
  values: T
): Gen<T[number]> {
  return sized(values.length).map((index) => values[index])
}

// https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
// todo - make it work with min-max===0 (neg numbers)
// or use lcg as limit
// gen positive,
// gen negative

export interface CharOptions {
  from?: string
  to?: string
}

/**
 * @summary Generates a number within a range
 * @category Constructor
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.char({ from: 'a', to: 'z' })
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 'i'
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function char({ from = " ", to = "~" }: CharOptions = {}) {
  return number({ min: from.charCodeAt(0), max: to.charCodeAt(0) }).map(
    (number) => String.fromCharCode(number)
  )
}

export interface StringOptions extends CharOptions, NumberOptions {}

/**
 * @summary Generates a number within a range
 * @category Constructor
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.string({ from: 'a', to: 'z', min: 1, max: 10 })
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 'xeuu'
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function string({
  from = " ",
  to = "~",
  min = 0,
  max = 100,
}: StringOptions = {}): Gen<string> {
  return array(char({ from, to }), { min, max }).map((chars) => chars.join(""))
}

/**
 * @summary
 * Returns the generator but allows it to be referenced before it is initialised,
 * useful with generating data types that are recursive.
 *
 * @category Constructor
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.lazy(() => string)
 * const string = gen.string({ from: 'a', to: 'z', min: 1, max: 10 })
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 'xeuu'
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function lazy<A>(thunk: () => Gen<A>): Gen<A> {
  return new Gen((state) => thunk().stateful(state))
}

/**
 * @summary Generates a tuple containing each generator's value.
 * @category Combinator
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.tuple([gen.number(), gen.char(), gen.string({ max: 20 })] as const)
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = [
 *   -1579057621,
 *   'w',
 *   'lm88RW:\\)RNhk(uDIr'
 * ]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function tuple<T extends readonly [unknown, ...Array<unknown>]>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<T> {
  return new Gen((state1) => {
    const result = []
    let value1

    for (const gen of gens) {
      ;[value1, state1] = gen.stateful(state1)
      result.push(value1)
    }

    return [result as never, state1]
  })
}

/**
 * @summary Generates a tuple containing each generator's value.
 * @category Combinator
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.required({
 *   first: gen.number(),
 *   second: gen.char(),
 *   third: gen.string({ max: 20 }))
 * })
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = {
 *   first: -1579057621,
 *   second: 'w',
 *   third: 'lm88RW:\\)RNhk(uDIr'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function required<T extends Record<string, unknown>>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<T> {
  return new Gen((state1) => {
    const result = {} as T
    let value1

    for (const property of Object.keys(gens) as Array<keyof T>) {
      const gen = gens[property]
      ;[value1, state1] = gen.stateful(state1)
      result[property] = value1
    }

    return [result as never, state1]
  })
}

/**
 * @summary Generates an object containing each generator's value with fixed keys.
 * @category Combinator
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.record(gen.char() ,gen.string({ max: 20}), { min:4, max: 8})
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = {
 *    '!': '6(A',
 *   W: ')RNhk(',
 *   s: 'H%`/Z\\)',
 *   u: 'rGL|=`D9',
 *   v: 'm88R'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function record<K extends string, A>(
  property: Gen<K>,
  value: Gen<A>,
  range: NumberOptions
): Gen<Record<K, A>> {
  return array(tuple([property, value]), range).map((entries) =>
    entries.reduce((result, [property, value]) => {
      result[property] = value
      return result
    }, {} as Record<K, A>)
  )
}

/**
 * @summary
 * Generates an object containing each generator's value with fixed keys
 * that may be present.
 *
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.partial({
 *   first: gen.number(),
 *   second: gen.char(),
 *   third: gen.string({ max: 20 }))
 * })
 * const result = generator.run({ seed: 2978653158, lcg: gen.lcg})
 * const expected = {
 *   first: -25570277,
 *   second: 'R',
 *   third: 'gL1>*mKFi0j>c5:r'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function partial<T extends Record<string, unknown>>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<Partial<T>> {
  return new Gen((state) => {
    const gensByProperty = Object.keys(gens) as Array<keyof T>
    const result = {} as Partial<T>
    let value
    let skip
    for (const property of gensByProperty) {
      ;[skip, state] = boolean.stateful(state)
      if (skip) continue
      const gen = gens[property]
      ;[value, state] = gen.stateful(state)
      result[property] = value
    }
    return [result, state]
  })
}

/**
 * @summary
 * Transforms an array of generators into a generator that contains an array.
 *
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const gens = [gen.char(), gen.number()]
 * const generator = gen.sequence(gens)
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = ['a', -28899327]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function sequence<T>(gens: Array<Gen<T>>): Gen<Array<T>> {
  return new Gen((state) => {
    const results: Array<T> = []
    let value: T
    for (const gen of gens) {
      ;[value, state] = gen.stateful(state)
      results.push(value)
    }
    return [results, state]
  })
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

/**
 * @summary
 * Merges the keys and values of two objects.
 *
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const first = gen.required({
 *   one: gen.number()
 * })
 * const second = gen.required({
 *   two: gen.char()
 * })
 * const generator = gen.intersect([first, second])
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = {
 *   one: 1662339019,
 *   two: 'O'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function intersect<T extends ReadonlyArray<unknown>>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<UnionToIntersection<T[number]>> {
  return new Gen((state) => {
    let value
    const result = {}
    for (const gen of gens) {
      ;[value, state] = gen.stateful(state)
      Object.assign(result, value)
    }
    return [result as never, state]
  })
}

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
 * @summary Generates a number betwwen 0 and 1.
 * @category Instance
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const result = gen.decimal.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 0.3161734988252105
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export const decimal = stated.map(({ seed, lcg }) => seed / (lcg.m - 1))

function biasByMix(
  value: number,
  { bias, mix }: Record<"bias" | "mix", number>
): number {
  return value * (1 - mix) + bias * mix
}

export interface PositiveOptions
  extends PositiveOptionsDefaults,
    PositiveOptionsPartial {}

export interface PositiveOptionsDefaults {
  /**
   * @default 0
   */
  min?: number
  /**
   * @default 4294967296
   */
  max?: number
  /**
   * @summary Skips validation check for options.
   * @remarks
   * Useful for increased performance when created inside of another generator.
   * @default false
   */
  unchecked?: boolean
}

export interface PositiveOptionsPartial {
  /**
   * @default undefined
   */
  bias?: number
  /**
   * @default undefined
   */
  influence?: number
}

type PositiveOptionsVerified = Required<PositiveOptionsDefaults> &
  PositiveOptionsPartial

/** @internal */
export function verifyPositiveArguments(
  options?: PositiveOptions
): PositiveOptionsVerified {
  const {
    min = 0,
    max = 2 ** 32,
    unchecked = false,
    bias,
    influence,
  } = options ?? {}

  if (!unchecked) {
    if (min < 0)
      throw new Error(`Minimum value of ${min} should not be less than 0`)
    if (max < 0)
      throw new Error(`Maximum value of ${max} should not be less than 0`)
    if (max < min)
      throw new Error(
        `Maximum value of ${max} should be equal to or greater than the minimum value of ${min}`
      )

    if (bias !== undefined) {
      if (bias < min)
        throw new Error(
          `Bias of ${bias} should not be less than the minimum value of ${min}`
        )
      if (bias > max)
        throw new Error(
          `Bias of ${bias} should not be greater than the maximum value of ${max}`
        )
      if (influence === undefined)
        throw new Error(
          `Influence should not be defined (${influence}) when the bias is not defined`
        )
    }

    if (influence !== undefined) {
      if (influence < 0)
        throw new Error(`Influence of ${influence} should not be less than 0`)
      if (influence > 1)
        throw new Error(
          `Influence of ${influence} should not be greater that 1`
        )
      if (bias === undefined)
        throw new Error(
          `Bias should not be defined (${bias}) when the influence is not defined`
        )
    }
  }

  return {
    max,
    min,
    unchecked,
    bias,
    influence,
  }
}

export function positive(options?: PositiveOptions): Gen<number> {
  const { max, min, bias, influence } = verifyPositiveArguments(options)

  const target = { min, max }
  return stated
    .doApply(
      "mix",
      decimal.map((decimal) => decimal * (influence ?? 1))
    )
    .map(({ seed, lcg, mix }) => {
      const source = { min: 0, max: lcg.m - 1 }
      const scaler = createPositiveScaler(source, target)
      const unbiased = scaler(seed)
      return influence != null
        ? biasByMix(unbiased, { bias: bias ?? 0, mix })
        : unbiased
    })
}

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

export interface NumberOptions {
  /**
   * @summary The smallest number that can be generated.
   * @default -4294967296 (2**-32)
   */
  min?: number
  /**
   * @summary The largest number that can be generated.
   * @default 4294967296 (2**32)
   */
  max?: number
}

/**
 * @summary Generates a number within a range
 * @category Constructor
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.number({ min: -57, max: 1400})
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = 404
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
// https://stackoverflow.com/questions/29325069/how-to-generate-random-numbers-biased-towards-one-value-in-a-range
export function number({
  min = -(2 ** 32),
  max = 2 ** 32,
}: NumberOptions = {}): Gen<number> {
  const target = { min, max }
  return stated.map(({ seed, lcg }) => {
    const source = { min: 0, max: lcg.m - 1 }
    const scaler = createScaler(source, target)
    const unrounded = scaler(seed)
    return Math.round(unrounded)
  })
}

/**
 * @summary
 * Creates a generator that uses one of the provided generators for
 * generating the value.
 *
 * @category Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const first = gen.required({
 *   one: gen.number()
 * })
 * const second = gen.required({
 *   two: gen.char()
 * })
 * const generator = gen.union([first, second])
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = {
 *  two: 'O'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function union<T extends ReadonlyArray<unknown>>(gens: {
  [P in keyof T]: Gen<T[P]>
}): Gen<T[number]> {
  return sized(gens.length).map((index) => gens[index])
}
