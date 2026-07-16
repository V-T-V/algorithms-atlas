// =============================================================================
// 扩展欧几里得完整版 · 纯算法实现
// gcd + Bézout 系数 + 模逆元 + 线性 Diophantine 通解。BigInt 精确。
// =============================================================================

export interface ExtGcdFullResult {
  g: bigint;
  x: bigint;
  y: bigint;
}

/** 事件钩子。 */
export interface ExGcdExtendedHooks {
  /** 一轮辗转：q 为商，记录 (oldR, r)、(oldS, s)、(oldT, t) 滚动更新前。 */
  onStep?: (q: bigint, oldR: bigint, r: bigint, oldS: bigint, s: bigint) => void;
  /** 余数归零，给出 gcd 与 Bézout 系数。 */
  onDone?: (g: bigint, x: bigint, y: bigint) => void;
}

const abs = (n: bigint): bigint => (n < 0n ? -n : n);

/** 扩展欧几里得（BigInt）：返回 {g, x, y}，g = gcd(|a|,|b|)，a·x + b·y = g。 */
export function extGcdFull(a: bigint, b: bigint, hooks: ExGcdExtendedHooks = {}): ExtGcdFullResult {
  const sa = a < 0n;
  const aa = abs(a);
  let oldR = aa;
  let r = abs(b);
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;

  while (r !== 0n) {
    const q = oldR / r;
    hooks.onStep?.(q, oldR, r, oldS, s);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  // 还原 a 的符号到 x
  const x = sa ? -oldS : oldS;
  const g = oldR;
  hooks.onDone?.(g, x, oldT);
  return { g, x, y: oldT };
}

/** 模逆元 inv(a) mod m，要求 gcd(a, m) = 1，否则抛错。返回值落在 [0, m)。 */
export function modInverse(a: bigint, m: bigint, hooks: ExGcdExtendedHooks = {}): bigint {
  const { g, x } = extGcdFull(((a % m) + m) % m, m, hooks);
  if (g !== 1n) throw new Error(`modInverse: a and m not coprime (gcd=${g})`);
  return ((x % m) + m) % m;
}

export interface DiophantineSolution {
  x0: bigint;
  y0: bigint;
  dx: bigint; // x 的步长 = b/g
  dy: bigint; // y 的步长 = a/g（取负方向）
  g: bigint;
}

/** 求解 a·x + b·y = c 的通解。c 不被 gcd(a,b) 整除时返回 null。 */
export function solveDiophantine(
  a: bigint,
  b: bigint,
  c: bigint,
  hooks: ExGcdExtendedHooks = {},
): DiophantineSolution | null {
  const { g, x, y } = extGcdFull(a, b, hooks);
  if (c % g !== 0n) return null;
  const k = c / g;
  return {
    x0: x * k,
    y0: y * k,
    dx: b / g,
    dy: a / g,
    g,
  };
}
