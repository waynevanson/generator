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
export class Gen {
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
export function vector(gen, { size }) {
    return new Gen((state1) => {
        const result = [];
        let value1;
        for (const _ of new Array(size)) {
            ;
            [value1, state1] = gen.stateful(state1);
            result.push(value1);
        }
        return [result, state1];
    });
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
export function array(gen, { min = 0, max } = {}) {
    return number({ min, max }).chain((size) => vector(gen, { size }));
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
export function nullable(gen) {
    const none = of(null);
    return boolean.chain((boolean) => (boolean ? gen : none));
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
export function undefinable(gen) {
    const none = of(undefined);
    return boolean.chain((boolean) => (boolean ? gen : none));
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
export function optional(gen) {
    const none = constants(undefined, null);
    return boolean.chain((boolean) => (boolean ? gen : none));
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
export function of(value) {
    return new Gen((state) => [value, state]);
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
export const seeded = new Gen((state) => [state.seed, state]).increment();
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
export const stated = new Gen((state) => [state, state]).increment();
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
export function sized(max) {
    return seeded.map((number) => number % max);
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
export const boolean = sized(2).map((number) => !number);
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
export function constants(...values) {
    return sized(values.length).map((index) => values[index]);
}
function clamp(number, { min, max }) {
    return number >= max ? max : number <= min ? min : number;
}
function scale(value, source, target) {
    return ((target.max - target.min) *
        ((value - source.min) / (source.max - source.min)) +
        target.min);
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
export function number({ min = -(2 ** 8), max = 2 ** 8, } = {}) {
    return stated.map(({ seed, lcg }) => {
        const source = { min: 0, max: lcg.m - 1 };
        const upper = {
            min: clamp(min, { min: 0, max }),
            max: clamp(max, { min: 0, max }),
        };
        const lower = {
            min: -clamp(min, { min, max: 0 }),
            max: -clamp(max, { min, max: 0 }),
        };
        const positive = Math.round(scale(seed, source, upper));
        const negative = Math.round(-scale(seed, source, lower));
        return positive + negative;
    });
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
export function char({ from = " ", to = "~" } = {}) {
    return number({ min: from.charCodeAt(0), max: to.charCodeAt(0) }).map((number) => String.fromCharCode(number));
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
export function string({ from, to, min = 0, max, } = {}) {
    return array(char({ from, to }), { min, max }).map((chars) => chars.join(""));
}
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
export function tuple(...gens) {
    return new Gen((state1) => {
        const result = [];
        let value1;
        for (const gen of gens) {
            ;
            [value1, state1] = gen.stateful(state1);
            result.push(value1);
        }
        return [result, state1];
    });
}
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
export function struct(gens) {
    return new Gen((state1) => {
        const result = {};
        let value1;
        for (const property of Object.keys(gens)) {
            const gen = gens[property];
            [value1, state1] = gen.stateful(state1);
            result[property] = value1;
        }
        return [result, state1];
    });
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
 *   '6': 'AQ',
 *   '?': 'Q/0',
 *   j: '%`/Z\\)!/p',
 *   r: 'L|=`D9sA',
 *   w: '1lm88RW:\\)RNhk(uDI'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function record(property, value, range) {
    return array(tuple(property, value), range).map((entries) => entries.reduce((result, [property, value]) => {
        result[property] = value;
        return result;
    }, {}));
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
 * const result = gen.range(gen.char(), { state, size: 4})
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
export function range(gen, { state, size = 10 }) {
    const result = [];
    let value;
    for (const _ of new Array(size)) {
        ;
        [value, state] = gen.stateful(state);
        result.push(value);
    }
    return result;
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
 *   second: 'm',
 *   third: 'j-gL1>*mKFi0j>c5:r'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function partial(gens) {
    return new Gen((state) => {
        const gensByProperty = Object.keys(gens);
        const result = {};
        let value;
        let skip;
        for (const property of gensByProperty) {
            ;
            [skip, state] = boolean.stateful(state);
            if (skip)
                continue;
            const gen = gens[property];
            [value, state] = gen.stateful(state);
            result[property] = value;
        }
        return [result, state];
    });
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
 * const first = gen.struct({
 *   one: gen.number()
 * })
 * const second = gen.partial({
 *   two: gen.char()
 * })
 * const generator = gen.intersect(first, second)
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = {
 *   one: 100
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function intersect(first, second) {
    return tuple(first, second).map(([first, second]) => Object.assign(first, second));
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
 * const first = gen.struct({
 *   one: gen.number()
 * })
 * const second = gen.struct({
 *   two: gen.char()
 * })
 * const generator = gen.union(first, second)
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = {
 *  two: 'O'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function union(first, second) {
    return boolean.chain((boolean) => (boolean ? first : second));
}
