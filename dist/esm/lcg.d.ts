/**
 * @summary A linear congruent generator, often used to increment a seed.
 * @category Class
 */
export declare class Lcg {
    a: number;
    c: number;
    m: number;
    constructor(a: number, c: number, m: number);
    /**
     * @summary Increments the seed using the linea congruent generator algorithm.
     * @category Combinator
     */
    increment(seed: number): number;
}
export declare const lcg: Lcg;
