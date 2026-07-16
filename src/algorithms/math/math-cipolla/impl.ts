// =============================================================================
// Cipolla · 模素数平方根
// =============================================================================

export interface CipollaHooks {
  onCandidate?: (a: number, omega2: number, isNonResidue: boolean) => void;
  onResult?: (root: number | null) => void;
}

function modPow(base: bigint, exp: number, m: bigint): bigint {
  let b = ((base % m) + m) % m;
  let e = exp;
  let r = 1n;
  while (e > 0) {
    if (e & 1) r = (r * b) % m;
    b = (b * b) % m;
    e = Math.floor(e / 2);
  }
  return r;
}

function isQR(a: bigint, p: bigint): boolean {
  // Euler 判别：a 是模 p 二次剩余当且仅当 a^((p-1)/2) ≡ 1
  if (a === 0n) return true;
  return modPow(a, Number((p - 1n) / 2n), p) === 1n;
}

// F_p[ω] 中元素 (x, y) 表示 x + yω，其中 ω² = t
function mulField(
  ax: bigint,
  ay: bigint,
  bx: bigint,
  by: bigint,
  t: bigint,
  p: bigint,
): [bigint, bigint] {
  const x = (((ax * bx) % p) + ((((ay * by) % p) * t) % p)) % p;
  const y = (((ax * by) % p) + ((ay * bx) % p)) % p;
  return [x, y];
}

function powField(x: bigint, y: bigint, exp: number, t: bigint, p: bigint): [bigint, bigint] {
  let rx = 1n;
  let ry = 0n;
  let bx = x;
  let by = y;
  let e = exp;
  while (e > 0) {
    if (e & 1) [rx, ry] = mulField(rx, ry, bx, by, t, p);
    [bx, by] = mulField(bx, by, bx, by, t, p);
    e = Math.floor(e / 2);
  }
  return [rx, ry];
}

export function cipolla(n: number, p: number, hooks: CipollaHooks = {}): number | null {
  const N = BigInt(n);
  const P = BigInt(p);
  // 规范化 n
  const a0 = ((N % P) + P) % P;
  if (a0 === 0n) {
    hooks.onResult?.(0);
    return 0;
  }
  if (!isQR(a0, P)) {
    hooks.onResult?.(null);
    return null;
  }
  // 找 a 使 a² - n 为非剩余
  for (let a = 1; a < p; a++) {
    const t = (((BigInt(a) * BigInt(a)) % P) - a0 + P) % P;
    const nonResidue = !isQR(t, P);
    hooks.onCandidate?.(a, Number(t), nonResidue);
    if (nonResidue) {
      // 在 F_p[ω] 中计算 (a + ω)^((p+1)/2)
      const exp = Number((P + 1n) / 2n);
      const [rx, ry] = powField(BigInt(a), 1n, exp, t, P);
      // ry 应为 0；rx 即为一个根
      void ry;
      const root = Number(((rx % P) + P) % P);
      hooks.onResult?.(root);
      return root;
    }
  }
  hooks.onResult?.(null);
  return null;
}
