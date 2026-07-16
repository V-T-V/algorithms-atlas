// Shabal 简化 256-bit · 实现
const MASK = (1n << 256n) - 1n;
export interface ShabalHooks {
  onBlock?: (i: number) => void;
  onResult?: (hash: bigint) => void;
}
export function hashShabal(data: string | readonly number[], hooks: ShabalHooks = {}): bigint {
  const bytes = typeof data === 'string' ? Array.from(new TextEncoder().encode(data)) : data;
  let state = 0x6a09e667f3bcc908n;
  for (let i = 0; i < bytes.length; i++) {
    state = (state * 0x100000001b3n + BigInt(bytes[i]!)) & MASK;
    state = ((state << 7n) | (state >> 249n)) & MASK;
    hooks.onBlock?.(i);
  }
  // finalize: 3 extra mix rounds
  for (let r = 0; r < 3; r++) state = ((state ^ (state >> 31n)) * 0xff51afd7ed558ccdn) & MASK;
  hooks.onResult?.(state);
  return state;
}
