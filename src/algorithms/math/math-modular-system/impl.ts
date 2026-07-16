// =============================================================================
// 同余方程组 · 合并 CRT
// =============================================================================

import { extGcd, mod } from '../math-modular-linear/impl.ts';

export interface ModularSystemHooks {
  onMerge?: (a: number, n: number, b: number, m: number, newA: number | null, newM: number) => void;
  onDone?: (a: number | null, n: number) => void;
}

export interface Congruence {
  remainder: number;
  modulus: number;
}

export interface SystemResult {
  remainder: number | null; // null 表示无解
  modulus: number;
}

export function solveCongruenceSystem(
  equations: Congruence[],
  hooks: ModularSystemHooks = {},
): SystemResult {
  if (equations.length === 0) {
    hooks.onDone?.(0, 1);
    return { remainder: 0, modulus: 1 };
  }
  let a = mod(equations[0]!.remainder, equations[0]!.modulus);
  let n = equations[0]!.modulus;
  for (let i = 1; i < equations.length; i++) {
    const b = mod(equations[i]!.remainder, equations[i]!.modulus);
    const m = equations[i]!.modulus;
    const r = extGcd(n, m);
    if ((b - a) % r.g !== 0) {
      hooks.onMerge?.(a, n, b, m, null, 0);
      hooks.onDone?.(null, 0);
      return { remainder: null, modulus: 0 };
    }
    const lcm = (n / r.g) * m;
    const t = mod((((b - a) / r.g) * r.x) % (m / r.g), m / r.g);
    const newA = mod(a + n * t, lcm);
    hooks.onMerge?.(a, n, b, m, newA, lcm);
    a = newA;
    n = lcm;
  }
  hooks.onDone?.(a, n);
  return { remainder: a, modulus: n };
}
