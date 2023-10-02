"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequence = exports.union = exports.intersect = exports.partial = exports.record = exports.required = exports.tuple = exports.lazy = exports.string = exports.char = exports.constants = exports.boolean = exports.sized = exports.of = exports.optional = exports.undefinable = exports.nullable = exports.array = exports.vector = void 0;
const class_1 = require("./class");
const instances_1 = require("./instances");
const number_1 = require("./number");
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
function vector(gen, { size }) {
    return new class_1.Gen((state1) => {
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
exports.vector = vector;
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
function array(gen, { min = 0, max = 50, size = 25, bias = 0 } = {}) {
    return (0, number_1.number)({ min, max }).chain((size) => vector(gen, { size }));
}
exports.array = array;
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
function nullable(gen) {
    const none = of(null);
    return exports.boolean.chain((boolean) => (boolean ? gen : none));
}
exports.nullable = nullable;
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
function undefinable(gen) {
    const none = of(undefined);
    return exports.boolean.chain((boolean) => (boolean ? gen : none));
}
exports.undefinable = undefinable;
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
function optional(gen) {
    const none = constants(undefined, null);
    return exports.boolean.chain((boolean) => (boolean ? gen : none));
}
exports.optional = optional;
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
function of(value) {
    return new class_1.Gen((state) => [value, state]);
}
exports.of = of;
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
function sized(max) {
    return instances_1.seeded.map((number) => number % max);
}
exports.sized = sized;
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
exports.boolean = sized(2).map((number) => !number);
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
function constants(...values) {
    return sized(values.length).map((index) => values[index]);
}
exports.constants = constants;
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
function char({ from = " ", to = "~" } = {}) {
    return (0, number_1.number)({ min: from.charCodeAt(0), max: to.charCodeAt(0) }).map((number) => String.fromCharCode(number));
}
exports.char = char;
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
function string({ from = " ", to = "~", min = 0, max = 100, } = {}) {
    return array(char({ from, to }), { min, max }).map((chars) => chars.join(""));
}
exports.string = string;
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
 * const expected = 'xxeu'
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
function lazy(thunk) {
    return new class_1.Gen((state) => thunk().stateful(state));
}
exports.lazy = lazy;
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
 *   -1579057621,
 *   'w',
 *   '1lm88RW:\\)RNhk(uDI'
 * ]
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
function tuple(...gens) {
    return new class_1.Gen((state1) => {
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
exports.tuple = tuple;
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
 *   third: '1lm88RW:\\)RNhk(uDI'
 * }
 *
 * assert.deepStrictEqual(result, expected)
 * ```
 */
function required(gens) {
    return new class_1.Gen((state1) => {
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
exports.required = required;
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
function record(property, value, range) {
    return array(tuple(property, value), range).map((entries) => entries.reduce((result, [property, value]) => {
        result[property] = value;
        return result;
    }, {}));
}
exports.record = record;
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
function partial(gens) {
    return new class_1.Gen((state) => {
        const gensByProperty = Object.keys(gens);
        const result = {};
        let value;
        let skip;
        for (const property of gensByProperty) {
            ;
            [skip, state] = exports.boolean.stateful(state);
            if (skip)
                continue;
            const gen = gens[property];
            [value, state] = gen.stateful(state);
            result[property] = value;
        }
        return [result, state];
    });
}
exports.partial = partial;
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
function intersect(first, second) {
    return tuple(first, second).map(([first, second]) => Object.assign(first, second));
}
exports.intersect = intersect;
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
function union(first, second) {
    return exports.boolean.chain((boolean) => (boolean ? first : second));
}
exports.union = union;
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
function sequence(gens) {
    return new class_1.Gen((state) => {
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
exports.sequence = sequence;
