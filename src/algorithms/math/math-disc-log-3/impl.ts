// =============================================================================
// 离散对数 BSGS
// =============================================================================

export interface BsgsHooks {
  onBaby?: (j: bigint, val: bigint) => void;
  onGiant?: (i: bigint, val: bigint) => void;
  onDone?: (x: bigint | null) => void;
}

export function discreteLog(a: bigint, b: bigint, m: bigint, hooks: BsgsHooks = {}): bigint | null {
  if (m === 1n) {
    hooks.onDone?.(0n);
    return 0n;
  }
  a = ((a % m) + m) % m;
  b = ((b % m) + m) % m;
  let n = 1n;
  while (n * n < m) n++;
  // baby steps
  const table = new Map<bigint, bigint>();
  let cur = 1n;
  for (let j = 0n; j < n; j++) {
    if (!table.has(cur)) table.set(cur, j);
    hooks.onBaby?.(j, cur);
    cur = (cur * a) % m;
  }
  // a^(-n) mod m = (a^n)^(-1) — 通过费马 a^(m-1-n) (仅当 m 素数)。改用迭代扩展欧几里得
  const aN = modPowLocal(a, n, m);
  const inv = modInverseEuc(aN, m);
  if (inv === null) {
    hooks.onDone?.(null);
    return null;
  }
  let gamma = b;
  for (let i = 0n; i < n + 1n; i++) {
    hooks.onGiant?.(i, gamma);
    if (table.has(gamma)) {
      const x = i * n + table.get(gamma)!;
      hooks.onDone?.(x);
      return x;
    }
    gamma = (gamma * inv) % m;
  }
  hooks.onDone?.(null);
  return null;
}

function modPowLocal(base: bigint, exp: bigint, m: bigint): bigint {
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

function modInverseEuc(a: bigint, m: bigint): bigint | null {
  const eg = extGcdLocal(a, m);
  if (eg.g !== 1n) return null;
  return ((eg.x % m) + m) % m;
}

function extGcdLocal(a: bigint, b: bigint): { g: bigint; x: bigint; y: bigint } {
  if (b === 0n) return { g: a, x: 1n, y: 0n };
  const r = extGcdLocal(b, a % b);
  return { g: r.g, x: r.y, y: r.x - (a / b) * r.y };
}
