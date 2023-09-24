"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seeded = exports.empty = exports.of = exports.Gen = void 0;
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
    stateful;
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
     * import * as gen from "chansheng"
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
     * ```ts
     * import * as gen from "chansheng"
     * import * as assert from "assert"
     *
     * const a = 2
     * const b = 8
     * const first = gen.of(a)
     * const second = gen.of(b)
     * const generator = first.applyFirst(second)
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
     * ```ts
     * import * as gen from "chansheng"
     * import * as assert from "assert"
     *
     * const value = 2
     * const generator = gen.of(value).chain(number => gen.of(number))
     * const result = generator.run({ seed: 0, lcg: gen.lcg })
     * const expected = value
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
     * Creates an object within the generator that has the property name provided
     * as a property and the value within the generato as the value.
     * Useful for composing with the `do` syntax provided.
     *
     * @category Combinator
     * ```ts
     * import * as gen from "chansheng"
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
}
exports.Gen = Gen;
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
function of(value) {
    return new Gen((state) => [value, state]);
}
exports.of = of;
/**
 * @summary
 * Creates a generator that has no value,
 * useful mostly for changing the state then applying it with another generator.
 * @category Instance
 */
exports.empty = of(undefined);
/**
 * @summary Creates a generator that uses the incoming seed as the value.
 * @category Instance
 */
exports.seeded = new Gen((state) => [state.seed, state]);
