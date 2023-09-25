/**
 * @summary A linear congruent generator, often used to increment a seed.
 * @category Class
 */
export class Lcg {
  constructor(public a: number, public c: number, public m: number) {}

  /**
   * @summary Increments the seed using the linear congruent generator algorithm.
   * @category Combinator
   */
  increment(seed: number): number {
    return (this.a * seed + this.c) % this.m
  }
}

export const lcg = new Lcg(1664525, 1013904223, 2 ** 32)
