"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.number = exports.negative = exports.positive = exports.verifyPositiveArguments = exports.decimal = void 0;
const functions_1 = require("./functions");
const util_1 = require("./number/util");
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
exports.decimal = functions_1.stated.map(({ seed, lcg }) => seed / (lcg.m - 1));
function biasByMix(value, { bias, mix }) {
    return value * (1 - mix) + bias * mix;
}
/** @internal */
function verifyPositiveArguments(options) {
    const { min = 0, max = Math.pow(2, 32), unchecked = false, bias, influence, } = options !== null && options !== void 0 ? options : {};
    if (!unchecked) {
        if (min < 0)
            throw new Error(`Minimum value of ${min} should not be less than 0`);
        if (max < 0)
            throw new Error(`Maximum value of ${max} should not be less than 0`);
        if (max < min)
            throw new Error(`Maximum value of ${max} should be equal to or greater than the minimum value of ${min}`);
        if (bias !== undefined) {
            if (bias < min)
                throw new Error(`Bias of ${bias} should not be less than the minimum value of ${min}`);
            if (bias > max)
                throw new Error(`Bias of ${bias} should not be greater than the maximum value of ${max}`);
            if (influence === undefined)
                throw new Error(`Influence should not be defined (${influence}) when the bias is not defined`);
        }
        if (influence !== undefined) {
            if (influence < 0)
                throw new Error(`Influence of ${influence} should not be less than 0`);
            if (influence > 1)
                throw new Error(`Influence of ${influence} should not be greater that 1`);
            if (bias === undefined)
                throw new Error(`Bias should not be defined (${bias}) when the influence is not defined`);
        }
    }
    return {
        max,
        min,
        unchecked,
        bias,
        influence,
    };
}
exports.verifyPositiveArguments = verifyPositiveArguments;
function positive(options) {
    const { max, min, bias, influence } = verifyPositiveArguments(options);
    const target = { min, max };
    return functions_1.stated
        .doApply("mix", exports.decimal.map((decimal) => decimal * (influence !== null && influence !== void 0 ? influence : 1)))
        .map(({ seed, lcg, mix }) => {
        const source = { min: 0, max: lcg.m - 1 };
        const scaler = (0, util_1.createPositiveScaler)(source, target);
        const unbiased = scaler(seed);
        return influence != null
            ? biasByMix(unbiased, { bias: bias !== null && bias !== void 0 ? bias : 0, mix })
            : unbiased;
    });
}
exports.positive = positive;
// todo - add more
function negative({ min = -(Math.pow(2, 32)), max = 0, bias = -0, influence = 0, unchecked = false, } = {}) {
    if (!unchecked) {
        if (min > 0)
            throw new Error(`Minimum value of ${min} should not be greater than 0`);
        if (max > 0)
            throw new Error(`Maximum value of ${max} should not be greater than 0`);
        if (min > max)
            throw new Error(`Minimum value of ${min} should be equal to or less than the maximum value of ${max}`);
        if (bias < 0)
            throw new Error(`Bias of ${bias} should not be less than 0`);
        if (bias > 1)
            throw new Error(`Bias of ${bias} should not be greater that 1`);
        if (influence < 0)
            throw new Error(`Influence of ${influence} should not be less than 0`);
        if (influence > 1)
            throw new Error(`Influence of ${influence} should not be greater that 1`);
    }
    return positive({
        min: max,
        max: -min,
        bias: -bias,
        influence,
        unchecked,
    }).map((positive) => -positive);
}
exports.negative = negative;
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
function number({ min = -(Math.pow(2, 32)), max = Math.pow(2, 32), } = {}) {
    const target = { min, max };
    return functions_1.stated.map(({ seed, lcg }) => {
        const source = { min: 0, max: lcg.m - 1 };
        const scaler = (0, util_1.createScaler)(source, target);
        const unrounded = scaler(seed);
        return Math.round(unrounded);
    });
}
exports.number = number;
