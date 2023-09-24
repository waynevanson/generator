export declare class Lcg {
    a: number;
    c: number;
    m: number;
    constructor(a: number, c: number, m: number);
    increment(seed: number): number;
}
export declare const lcg: Lcg;
