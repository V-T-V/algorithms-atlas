// =============================================================================
// Pell 方程 · 纯算法实现
// 求 x² − D·y² = 1 的最小正整数解 (x, y)。
// =============================================================================

export interface PellResult {
  x: bigint;
  y: bigint;
}

/** 事件钩子。 */
export interface PellHooks {
  /** 连分数展开的下一项 a。 */
  onTerm?: (a: bigint) => void;
  /** 计算一个收敛子 (h, k)。 */
  onConvergent?: (h: bigint, k: bigint) => void;
  /** 找到基础解。 */
  onResult?: (x: bigint, y: bigint) => void;
}

function isqrt(n: bigint): bigint {
  if (n < 0n) throw new RangeError('isqrt: negative');
  if (n < 2n) return n;
  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}

/**
 * 求解 Pell 方程 x² − D·y² = 1 的最小正整数解。
 * @param D 非完全平方正整数
 * @returns { x, y }
 */
export function solvePell(D: number | bigint, hooks: PellHooks = {}): PellResult {
  const DD = typeof D === 'number' ? BigInt(D) : D;
  if (DD <= 1n) throw new RangeError('solvePell: D must be > 1');
  const a0 = isqrt(DD);
  if (a0 * a0 === DD) throw new RangeError('solvePell: D must not be a perfect square');

  // 连分数展开 √D：维护 (m, d, a)
  let m = 0n;
  let d = 1n;
  let a = a0;
  // 收敛子：h_{-2}=0, h_{-1}=1；k_{-2}=1, k_{-1}=0
  let hPrev = 0n;
  let hCur = 1n;
  let kPrev = 1n;
  let kCur = 0n;

  const convergents: Array<{ h: bigint; k: bigint }> = [];
  let idx = 0;
  // 第一项
  hCur = a; // h_0 = a_0
  kCur = 1n; // k_0 = 1
  hooks.onTerm?.(a);
  hooks.onConvergent?.(hCur, kCur);
  convergents.push({ h: hCur, k: kCur });

  while (true) {
    m = d * a - m;
    d = (DD - m * m) / d;
    a = (a0 + m) / d;
    idx++;
    hooks.onTerm?.(a);
    // h_n = a_n·h_{n-1} + h_{n-2}；k_n = a_n·k_{n-1} + k_{n-2}
    const hNew = a * hCur + hPrev;
    const kNew = a * kCur + kPrev;
    hPrev = hCur;
    hCur = hNew;
    kPrev = kCur;
    kCur = kNew;
    hooks.onConvergent?.(hCur, kCur);
    convergents.push({ h: hCur, k: kCur });
    // 检验：h² − D·k² == 1？
    if (hCur * hCur - DD * kCur * kCur === 1n) {
      hooks.onResult?.(hCur, kCur);
      return { x: hCur, y: kCur };
    }
    if (idx > 100000) throw new Error('solvePell: iteration limit exceeded');
  }
}
