// =============================================================================
// 法里数列（Farey Sequence）· 纯算法实现
// F_n = [0,1] 之间分母 ≤ n 的所有既约分数升序排列。
// 递推构造：相邻两项 a/b, c/d 满足 bc - ad = 1；下一项 e/f 满足
//   e = ⌊(n + b) / d⌋ * c - a,  f = ⌊(n + b) / d⌋ * d - b。
// 时间 O(|F_n|) = O(n²)。
// =============================================================================

export interface FareyHooks {
  onTerm?: (numer: number, denom: number) => void;
  onResult?: (seq: Array<[number, number]>) => void;
}

export function fareySequence(n: number, hooks: FareyHooks = {}): Array<[number, number]> {
  if (n < 1) {
    hooks.onResult?.([]);
    return [];
  }
  // 起点 0/1 与 1/1
  let a = 0;
  let b = 1;
  let c = 1;
  let d = n;
  const seq: Array<[number, number]> = [];
  seq.push([a, b]);
  hooks.onTerm?.(a, b);
  while (c <= n) {
    seq.push([c, d]);
    hooks.onTerm?.(c, d);
    const k = Math.floor((n + b) / d);
    const e = k * c - a;
    const f = k * d - b;
    a = c;
    b = d;
    c = e;
    d = f;
  }
  hooks.onResult?.(seq);
  return seq;
}

/** 仅返回 F_n 的项数（公式 |F_n| = 1 + Σ_{k=1}^{n} φ(k)）。 */
export function fareyLength(n: number): number {
  if (n < 1) return 0;
  const phi = new Array<number>(n + 1);
  for (let i = 0; i <= n; i++) phi[i] = i;
  for (let i = 2; i <= n; i++) {
    if (phi[i] === i) {
      // i 素
      for (let j = i; j <= n; j += i) {
        phi[j] = (phi[j]! / i) * (i - 1);
      }
    }
  }
  let len = 1;
  for (let k = 1; k <= n; k++) len += phi[k]!;
  return len;
}
