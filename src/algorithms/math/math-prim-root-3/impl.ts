// =============================================================================
// 原根
// =============================================================================

export interface PrimRootHooks {
  onCandidate?: (g: bigint, isRoot: boolean) => void;
  onDone?: (g: bigint | null, phi: bigint) => void;
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

function primeFactors(n: bigint): bigint[] {
  const factors = new Set<bigint>();
  let x = n;
  for (let d = 2n; d * d <= x; d++) {
    if (x % d === 0n) {
      factors.add(d);
      while (x % d === 0n) x /= d;
    }
  }
  if (x > 1n) factors.add(x);
  return [...factors];
}

function eulerPhi(n: bigint): bigint {
  let result = n;
  let x = n;
  for (let d = 2n; d * d <= x; d++) {
    if (x % d === 0n) {
      while (x % d === 0n) x /= d;
      result -= result / d;
    }
  }
  if (x > 1n) result -= result / x;
  return result;
}

export function primitiveRoot(m: number | bigint, hooks: PrimRootHooks = {}): bigint | null {
  const M = typeof m === 'bigint' ? m : BigInt(m);
  if (M <= 1n) return null;
  if (M === 2n) {
    hooks.onDone?.(1n, 1n);
    return 1n;
  }
  if (M === 4n) {
    hooks.onDone?.(3n, 2n);
    return 3n;
  }
  const phi = eulerPhi(M);
  const factors = primeFactors(phi);
  for (let g = 2n; g < M; g++) {
    let ok = true;
    for (const p of factors) {
      if (pow(g, phi / p, M) === 1n) {
        ok = false;
        break;
      }
    }
    hooks.onCandidate?.(g, ok);
    if (ok) {
      hooks.onDone?.(g, phi);
      return g;
    }
  }
  hooks.onDone?.(null, phi);
  return null;
}

export { eulerPhi, primeFactors };
