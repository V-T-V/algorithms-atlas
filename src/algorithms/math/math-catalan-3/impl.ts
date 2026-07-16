// =============================================================================
// Catalan 数
// =============================================================================

import { Combinatorics } from '../math-comb-3/impl.ts';

export interface CatalanHooks {
  onValue?: (n: number, value: bigint) => void;
  onDone?: (values: bigint[]) => void;
}

export class Catalan {
  private readonly comb: Combinatorics;
  private readonly maxN: number;
  constructor(maxN: number) {
    this.maxN = maxN;
    this.comb = new Combinatorics(2 * maxN + 1);
  }
  at(n: number): bigint {
    if (n < 0 || n > this.maxN) return 0n;
    const c2n = this.comb.choose(2 * n, n);
    const invN1 = modPow(BigInt(n + 1), 1_000_000_007n - 2n, 1_000_000_007n);
    return (c2n * invN1) % 1_000_000_007n;
  }
}

function modPow(base: bigint, exp: bigint, m: bigint): bigint {
  let r = 1n;
  let b = base % m;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return r;
}

export function catalanList(maxN: number, hooks: CatalanHooks = {}): bigint[] {
  const c = new Catalan(maxN);
  const values: bigint[] = [];
  for (let n = 0; n <= maxN; n++) {
    const v = c.at(n);
    values.push(v);
    hooks.onValue?.(n, v);
  }
  hooks.onDone?.(values);
  return values;
}
