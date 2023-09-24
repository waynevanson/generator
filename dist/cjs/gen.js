"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seeded = exports.empty = exports.of = exports.Gen = void 0;
/**
 * @summary
 * Generator that holds the computation for generating values and the
 * {@link State | internal state} for incrementing the seed.
 */
class Gen {
    stateful;
    constructor(stateful) {
        this.stateful = stateful;
    }
    /**
     * @summary Runs the generator and returns the resulting value.
     * @category Destructor
     */
    run(state) {
        return this.stateful(state)[0];
    }
    /**
     * @summary Runs
     * @category Combinator
     */
    modify(f) {
        return new Gen((state1) => {
            const [value1, state2] = this.stateful(state1);
            return [value1, f(state2)];
        });
    }
    /**
     * @summary Increments the seed within the state using the {@link Lcg | linear congruent generator}
     * @category Combinator
     */
    increment() {
        return this.modify(({ lcg, seed }) => ({ lcg, seed: lcg.increment(seed) }));
    }
}
exports.Gen = Gen;
/**
 * @summary Creates a generator where the vaue is of type A.
 * @category Constructor
 *
 * @example
 * ```ts
 * import * as gen from "chansheng"
 * import * as assert from "node:assert"
 *
 * const value = 2
 * const generator = gen.of(value)
 * const result = generator({ seed: 0, lcg: gen.lcg})
 *
 * assert.deepStrictEqual(result, value)
 * ```
 */
function of(value) {
    return new Gen((state) => [value, state]);
}
exports.of = of;
/**
 * @summary
 * Creates a generator that has no value,
 * useful mostly for changing the state then applying it with another generator.
 * @category Instance
 */
exports.empty = of(undefined);
/**
 * @summary Creates a generator that uses the incoming seed as the value.
 * @category Instance
 */
exports.seeded = new Gen((state) => [state.seed, state]);
