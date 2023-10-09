import { Gen } from "./class";
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
export declare const decimal: Gen<number>;
export interface PositiveOptions extends PositiveOptionsDefaults, PositiveOptionsPartial {
}
export interface PositiveOptionsDefaults {
    /**
     * @default 0
     */
    min?: number;
    /**
     * @default 4294967296
     */
    max?: number;
    /**
     * @summary Skips validation check for options.
     * @remarks
     * Useful for increased performance when created inside of another generator.
     * @default false
     */
    unchecked?: boolean;
}
export interface PositiveOptionsPartial {
    /**
     * @default undefined
     */
    bias?: number;
    /**
     * @default undefined
     */
    influence?: number;
}
export declare function positive(options?: PositiveOptions): Gen<number>;
export declare function negative({ min, max, bias, influence, unchecked, }?: {
    min?: number | undefined;
    max?: number | undefined;
    bias?: number | undefined;
    influence?: number | undefined;
    unchecked?: boolean | undefined;
}): Gen<number>;
export interface NumberOptions {
    /**
     * @summary The smallest number that can be generated.
     * @default -4294967296 (2**-32)
     */
    min?: number;
    /**
     * @summary The largest number that can be generated.
     * @default 4294967296 (2**32)
     */
    max?: number;
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
export declare function number({ min, max, }?: NumberOptions): Gen<number>;
