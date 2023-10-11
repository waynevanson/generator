interface Range extends Record<"min" | "max", number> {
}
export declare function clamp(number: number, { min, max }: Range): number;
/**
 * @param source
 * The min and max inclusive range of the source number that is greater than or
 * equal to 0.
 * @param target
 * The min and max inclusive range of the source number that is greater than or
 * equal to 0.
 * @returns
 */
export declare function createPositiveScaler(source: Range, target: Range): (number: number) => number;
/**
 * @param source
 * The min and max inclusive range of the source number.
 * @param target
 * The min and max inclusive range of the source number.
 * @returns
 */
export declare function createScaler(source: Range, target: Range): (number: number) => number;
export {};
