/**
 * @summary A linear congruent generator, often used to increment a seed.
 * @category Class
 */
export class Lcg {
    a;
    c;
    m;
    constructor(a, c, m) {
        this.a = a;
        this.c = c;
        this.m = m;
    }
    /**
     * @summary Increments the seed using the linea congruent generator algorithm.
     * @category Combinator
     */
    increment(seed) {
        return (this.a * seed + this.c) % this.m;
    }
}
export const lcg = new Lcg(1664525, 1013904223, 2 ** 32);
