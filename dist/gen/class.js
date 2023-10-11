"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gen = void 0;
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
class Gen {
    constructor(stateful) {
        this.stateful = stateful;
    }
    /**
     * @summary Runs the generator and returns the resulting value.
     * @category Destructor
     */
    run(state) {
        return this.stateful(state)[0];
    }
    /**
     * @summary Modifies the state of the generate without modifying the value.
     * @category Combinator
     */
    modify(f) {
        return new Gen((state1) => {
            const [value1, state2] = this.stateful(state1);
            return [value1, f(state2)];
        });
    }
    /**
     * @summary Increments the seed within the state using the {@link Lcg | linear congruent generator}
     * @category Combinator
     */
    increment() {
        return this.modify(({ lcg, seed }) => ({ lcg, seed: lcg.increment(seed) }));
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
    map(f) {
        return new Gen((state1) => {
            const [value1, state2] = this.stateful(state1);
            const value2 = f(value1);
            return [value2, state2];
        });
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
    flap(parameter) {
        return this.map((f) => f(parameter));
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
    apply(gen) {
        return new Gen((state1) => {
            const [value1, state2] = this.stateful(state1);
            const [value2, state3] = gen.stateful(state2);
            const value3 = value1(value2);
            return [value3, state3];
        });
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
    applyFirst(gen) {
        return this.map((a) => () => a).apply(gen);
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
    applySecond(gen) {
        return this.map((_) => (b) => b).apply(gen);
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
    chain(f) {
        return new Gen((state1) => {
            const [value1, state2] = this.stateful(state1);
            return f(value1).stateful(state2);
        });
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
    chainFirst(f) {
        return this.chain((a) => f(a).map(() => a));
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
    do(property) {
        return this.map((value) => ({ [property]: value }));
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
    doChain(property, kleisli) {
        return this.chain((a) => kleisli(a).map((b) => Object.assign({}, a, { [property]: b })));
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
    doApply(property, gen) {
        return this.chain((a) => gen.map((b) => Object.assign({}, a, { [property]: b })));
    }
    filter(refinement) {
        return new Gen((state1) => {
            let value1;
            while (true) {
                ;
                [value1, state1] = this.stateful(state1);
                if (refinement(value1))
                    return [value1, state1];
            }
        });
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
    range({ state, size = 10 }) {
        const result = [];
        let value;
        for (const _ of new Array(size)) {
            ;
            [value, state] = this.stateful(state);
            result.push(value);
        }
        return result;
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
    intersect(and) {
        return new Gen((state0) => {
            const [a, state1] = this.stateful(state0);
            const [b, state2] = and.stateful(state1);
            return [Object.assign({}, a, b), state2];
        });
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
    union(or) {
        return new Gen(({ seed, lcg }) => {
            const boolean = seed < lcg.m / 2;
            seed = lcg.increment(seed);
            return boolean
                ? this.stateful({ seed, lcg })
                : or.stateful({ seed, lcg });
        });
    }
}
exports.Gen = Gen;
