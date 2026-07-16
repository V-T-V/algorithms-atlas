// =============================================================================
// Lucas 定理
// =============================================================================

export interface LucasHooks {
  onDigit?: (nDigit: bigint, kDigit: bigint, partial: bigint) => void;
  onDone?: (value: bigint) => void;
}

function smallFactTable(p: bigint): bigint[] {
  const f = new Array<bigint>(Number(p)).fill(1n);
  for (let i = 1n; i < p; i++) f[Number(i)] = (f[Number(i - 1n)]! * i) % p;
  return f;
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

function smallComb(n: bigint, k: bigint, p: bigint, fact: bigint[]): bigint {
  if (k < 0n || k > n) return 0n;
  if (k === 0n || k === n) return 1n;
  const num = fact[Number(n)]!;
  const den = (fact[Number(k)]! * fact[Number(n - k)]!) % p;
  return (num * pow(den, p - 2n, p)) % p;
}

export function lucas(n: bigint, k: bigint, p: bigint, hooks: LucasHooks = {}): bigint {
  const fact = smallFactTable(p);
  let result = 1n;
  let N = n;
  let K = k;
  while (N > 0n || K > 0n) {
    const ni = N % p;
    const ki = K % p;
    const c = smallComb(ni, ki, p, fact);
    result = (result * c) % p;
    hooks.onDigit?.(ni, ki, result);
    N /= p;
    K /= p;
  }
  hooks.onDone?.(result);
  return result;
}
