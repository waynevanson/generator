export class Lcg {
    a;
    c;
    m;
    constructor(a, c, m) {
        this.a = a;
        this.c = c;
        this.m = m;
    }
    increment(seed) {
        return (this.a * seed + this.c) % this.m;
    }
}
export const lcg = new Lcg(1664525, 1013904223, 2 ** 32);
