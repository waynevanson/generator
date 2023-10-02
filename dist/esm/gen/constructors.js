import { Gen } from "./class";
import { seeded } from "./instances";
import { number, positive } from "./number";
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
export function vector(gen, size) {
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
 * const generator = gen.array(gen.sized(10), { min: 3, max:4})
 * const result = generator.run({ seed: 0, lcg: gen.lcg})
 * const expected = [2, 7, 4]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function array(gen, { min = 0, max = 50, bias, influence } = {}) {
    return positive({ min, max, bias, influence }).chain((size) => vector(gen, Math.round(size)));
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
    const none = constants([undefined, null]);
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
export const boolean = sized(2).map((number) => number % 2 === 0);
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
export function constants(values) {
    return sized(values.length).map((index) => values[index]);
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
 * const expected = 'xeuu'
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function string({ from = " ", to = "~", min = 0, max = 100, } = {}) {
    return array(char({ from, to }), { min, max }).map((chars) => chars.join(""));
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
export function lazy(thunk) {
    return new Gen((state) => thunk().stateful(state));
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
export function tuple(gens) {
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
export function required(gens) {
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
export function record(property, value, range) {
    return array(tuple([property, value]), range).map((entries) => entries.reduce((result, [property, value]) => {
        result[property] = value;
        return result;
    }, {}));
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
 *   third: '-gL1>*mKFi0j>c5:r,'
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
 * const first = gen.required({
 *   one: gen.number()
 * })
 * const second = gen.required({
 *   two: gen.char()
 * })
 * const generator = gen.intersect(first, second)
 * const result = generator.run({ seed: 2978653157, lcg: gen.lcg})
 * const expected = {
 *   one: 1662339019,
 *   two: 'O'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
export function intersect(first, second) {
    return tuple([first, second]).map(([first, second]) => Object.assign(first, second));
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
export function sequence(gens) {
    return new Gen((state) => {
        const results = [];
        let value;
        for (const gen of gens) {
            ;
            [value, state] = gen.stateful(state);
            results.push(value);
        }
        return [results, state];
    });
}
