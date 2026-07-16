// =============================================================================
// 模逆元（费马）
// =============================================================================

import { modPow } from '../math-mod-3/impl.ts';

export interface ModInvHooks {
  onPow?: (exp: bigint) => void;
  onDone?: (inv: bigint | null) => void;
}

export function modInverse(
  a: number | bigint,
  p: number | bigint,
  hooks: ModInvHooks = {},
): bigint | null {
  const A = typeof a === 'bigint' ? a : BigInt(a);
  const P = typeof p === 'bigint' ? p : BigInt(p);
  if (P <= 1n) {
    hooks.onDone?.(null);
    return null;
  }
  const reduced = ((A % P) + P) % P;
  if (reduced === 0n) {
    hooks.onDone?.(null);
    return null;
  }
  hooks.onPow?.(P - 2n);
  const inv = modPow(reduced, P - 2n, P);
  hooks.onDone?.(inv);
  return inv;
}
