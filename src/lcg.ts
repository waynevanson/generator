export const M_MODULUS = 2 ** 32
export const C_CONSTANT = 1013904223
export const A_MULTIPLIER = 1664525

export const SEED_MIN = 0
export const SEED_MAX = M_MODULUS - 1

export function increment(seed: number) {
  return (A_MULTIPLIER * seed + C_CONSTANT) % M_MODULUS
}
