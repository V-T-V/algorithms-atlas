// =============================================================================
// NTT (mod 998244353, g=3)
// =============================================================================

const MOD = 998244353n;
const G = 3n;

export interface NttHooks {
  onButterfly?: (stage: number, i: number, j: number) => void;
  onDone?: (result: bigint[]) => void;
}

function pow(base: bigint, exp: bigint, m: bigint): bigint {
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

function bitReverse(x: number, bits: number): number {
  let r = 0;
  for (let i = 0; i < bits; i++) {
    if ((x >> i) & 1) r |= 1 << (bits - 1 - i);
  }
  return r;
}

function ntt(a: bigint[], invert: boolean, hooks: NttHooks = {}): void {
  const n = a.length;
  const bits = Math.log2(n);
  for (let i = 0; i < n; i++) {
    const j = bitReverse(i, bits);
    if (i < j) {
      const t = a[i]!;
      a[i] = a[j]!;
      a[j] = t;
    }
  }
  for (let len = 2, stage = 0; len <= n; len <<= 1, stage++) {
    const w = invert
      ? pow(pow(G, (MOD - 1n) / BigInt(len), MOD), MOD - 2n, MOD)
      : pow(G, (MOD - 1n) / BigInt(len), MOD);
    for (let i = 0; i < n; i += len) {
      let wn = 1n;
      for (let j = 0; j < len / 2; j++) {
        const u = a[i + j]!;
        const v = (a[i + j + len / 2]! * wn) % MOD;
        a[i + j] = (u + v) % MOD;
        a[i + j + len / 2] = (u - v + MOD) % MOD;
        wn = (wn * w) % MOD;
        hooks.onButterfly?.(stage, i + j, i + j + len / 2);
      }
    }
  }
  if (invert) {
    const nInv = pow(BigInt(n), MOD - 2n, MOD);
    for (let i = 0; i < n; i++) a[i] = (a[i]! * nInv) % MOD;
  }
}

export function multiplyNTT(
  a: readonly number[],
  b: readonly number[],
  hooks: NttHooks = {},
): bigint[] {
  let size = 1;
  while (size < a.length + b.length) size <<= 1;
  const fa: bigint[] = new Array(size).fill(0n);
  const fb: bigint[] = new Array(size).fill(0n);
  for (let i = 0; i < a.length; i++) fa[i] = BigInt(a[i]!);
  for (let i = 0; i < b.length; i++) fb[i] = BigInt(b[i]!);
  ntt(fa, false, hooks);
  ntt(fb, false, hooks);
  for (let i = 0; i < size; i++) fa[i] = (fa[i]! * fb[i]!) % MOD;
  ntt(fa, true, hooks);
  const result = fa.slice(0, a.length + b.length - 1);
  hooks.onDone?.(result);
  return result;
}
