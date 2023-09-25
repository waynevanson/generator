import { Lcg } from "./lcg.js";
/**
 * @summary The internal state used by a {@link Gen | generator}.
 */
export interface State {
    /**
     * @summary The seed used for generating data.
     */
    seed: number;
    /**
     * @summary A linear congruent generator used to increment the seed.
     */
    lcg: Lcg;
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
export declare class Gen<A> {
    stateful: (state: State) => [A, State];
    constructor(stateful: (state: State) => [A, State]);
    /**
     * @summary Runs the generator and returns the resulting value.
     * @category Destructor
     */
    run(state: State): A;
    /**
     * @summary Modifies the state of the generate without modifying the value.
     * @category Combinator
     */
    modify(f: (state: State) => State): Gen<A>;
    /**
     * @summary Increments the seed within the state using the {@link Lcg | linear congruent generator}
     * @category Combinator
     */
    increment(): Gen<A>;
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
    map<B>(f: (value: A) => B): Gen<B>;
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
    flap<R, B>(this: Gen<Extract<A, (parameter: R) => B>>, parameter: R): Gen<B>;
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
    apply<R, B>(this: Gen<Extract<A, (parameter: R) => B>>, gen: Gen<R>): Gen<B>;
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
    applyFirst<B>(gen: Gen<B>): Gen<A>;
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
    applySecond<B>(gen: Gen<B>): Gen<B>;
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
    chain<B>(f: (value: A) => Gen<B>): Gen<B>;
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
    chainFirst<B>(f: (value: A) => Gen<B>): Gen<A>;
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
    do<K extends string>(property: K): Gen<{
        [P in K]: A;
    }>;
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
    doChain<K extends string, B>(property: Exclude<K, keyof A>, kleisli: (value: A) => Gen<B>): Gen<{
        [P in keyof A | K]: P extends keyof A ? A[P] : B;
    }>;
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
    doApply<K extends string, B>(property: Exclude<K, keyof A>, gen: Gen<B>): Gen<{
        [P in keyof A | K]: P extends keyof A ? A[P] : B;
    }>;
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
    filter(predicate: (value: A) => boolean): Gen<A>;
    filter<B extends A>(refinement: (value: A) => value is B): Gen<B>;
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
 * const generator = gen.vector(gen.sized(10), { size: 4 })
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = [0, 3, 2, 7]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export declare function vector<A>(gen: Gen<A>, { size }: {
    size: number;
}): Gen<Array<A>>;
/**
 * @summary Returns an array of a fixed size with data from the generator.
 * @categoy Combinator
 *
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "assert"
 *
 * const generator = gen.vector(gen.sized(10), { size: 4 })
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = [0, 3, 2, 7]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export declare function array<A>(gen: Gen<A>, { min, max }: NumberOptions): Gen<Array<A>>;
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
export declare function nullable<A>(gen: Gen<A>): Gen<A | null>;
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
export declare function undefinable<A>(gen: Gen<A>): Gen<A | undefined>;
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
export declare function optional<A>(gen: Gen<A>): Gen<A | null | undefined>;
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
export declare function of<A>(value: A): Gen<A>;
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
export declare const seeded: Gen<number>;
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
export declare const stated: Gen<State>;
export interface NumberOptions {
    min?: number;
    max?: number;
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
export declare function sized(max: number): Gen<number>;
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
export declare const boolean: Gen<boolean>;
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
 * const generator = gen.constants("hello", "world")
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = "hello"
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export declare function constants<T extends [unknown, ...Array<unknown>]>(...values: T): Gen<T[number]>;
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
export declare function number({ min, max, }?: NumberOptions): Gen<number>;
export interface CharOptions {
    from?: string;
    to?: string;
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
export declare function char({ from, to }?: CharOptions): Gen<string>;
export interface StringOptions extends CharOptions, NumberOptions {
}
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
 * const expected = 'xxeu'
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export declare function string({ from, to, min, max, }?: StringOptions): Gen<string>;
/**
 * @summary Generates a tuple containing each generator's value.
 * @category Combinator
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.tuple(gen.number(), gen.char(), gen.string({ max: 20 }))
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = [
 *   -94,
 *   'w',
 *   '1lm88RW:\\)RNhk(uDI'
 * ]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export declare function tuple<T extends [unknown, ...Array<unknown>]>(...gens: {
    [P in keyof T]: Gen<T[P]>;
}): Gen<T>;
/**
 * @summary Generates a tuple containing each generator's value.
 * @category Combinator
 * @example
 * ```ts
 * import * as gen from "@waynevanson/generator"
 * import * as assert from "node:assert"
 *
 * const generator = gen.struct({
 *   first: gen.number(),
 *   second: gen.char(),
 *   third: gen.string({ max: 20 }))
 * })
 * const result = generator.run({ seed: 1357954837, lcg: gen.lcg})
 * const expected = {
 *   first: -94,
 *   second: 'w',
 *   third: '1lm88RW:\\)RNhk(uDI'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export declare function struct<T extends Record<string, unknown>>(gens: {
    [P in keyof T]: Gen<T[P]>;
}): Gen<T>;
