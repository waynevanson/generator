import { Gen } from "./class"
import { seeded, stated } from "./foundation"
import { NumberOptions, number, positive } from "./number"

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
