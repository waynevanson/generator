"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lcg = exports.Lcg = void 0;
class Lcg {
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
exports.Lcg = Lcg;
exports.lcg = new Lcg(1664525, 1013904223, 2 ** 32);
