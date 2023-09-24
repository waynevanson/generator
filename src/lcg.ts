export class Lcg {
  constructor(public a: number, public c: number, public m: number) {}

  increment(seed: number): number {
    return (this.a * seed + this.c) % this.m
  }
}

export const lcg = new Lcg(1664525, 1013904223, 2 ** 32)
