"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScaler = exports.createPositiveScaler = exports.clamp = void 0;
function clamp(number, { min, max }) {
    return number >= max ? max : number <= min ? min : number;
}
exports.clamp = clamp;
/**
 * @param source
 * The min and max inclusive range of the source number that is greater than or
 * equal to 0.
 * @param target
 * The min and max inclusive range of the source number that is greater than or
 * equal to 0.
 * @returns
 */
function createPositiveScaler(source, target) {
    const top = target.max - target.min;
    const bot = source.max - source.min;
    return (value) => top * ((value - source.min) / bot) + target.min;
}
exports.createPositiveScaler = createPositiveScaler;
/**
 * @param source
 * The min and max inclusive range of the source number.
 * @param target
 * The min and max inclusive range of the source number.
 * @returns
 */
function createScaler(source, target) {
    const { min, max } = target;
    const upper = {
        min: clamp(min, { min: 0, max }),
        max: clamp(max, { min: 0, max }),
    };
    const lower = {
        min: -clamp(min, { min, max: 0 }),
        max: -clamp(max, { min, max: 0 }),
    };
    const createPositive = createPositiveScaler(source, upper);
    const createNegative = createPositiveScaler(source, lower);
    return (value) => createPositive(value) - createNegative(value);
}
exports.createScaler = createScaler;
