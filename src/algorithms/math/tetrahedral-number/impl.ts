// =============================================================================
// 四面体数
// Te(n) = n(n+1)(n+2)/6 = C(n+2,3)
// 判定：x 是四面体数 iff 存在正整数 k 使 k(k+1)(k+2)/6 = x。
//   由 k ≈ (6x)^(1/3) 给出近似，再小范围校验。
// =============================================================================

export interface TetrahedralHooks {
  onTerm?: (i: number, value: number) => void;
  onResult?: (isTetrahedral: boolean, rank: number | null) => void;
}

export interface TetrahedralResult {
  isTetrahedral: boolean;
  rank: number | null;
}

/** 第 n 个四面体数 Te(n) = n(n+1)(n+2)/6。 */
export function tetrahedral(n: number): number {
  if (n < 1) return 0;
  return (n * (n + 1) * (n + 2)) / 6;
}

/** 生成前 n 个四面体数。 */
export function tetrahedralSequence(n: number, hooks: TetrahedralHooks = {}): number[] {
  const seq: number[] = [];
  for (let i = 1; i <= n; i++) {
    const t = tetrahedral(i);
    seq.push(t);
    hooks.onTerm?.(i, t);
  }
  return seq;
}

/** 判定 x 是否为四面体数；返回其排名。 */
export function isTetrahedral(x: number, hooks: TetrahedralHooks = {}): TetrahedralResult {
  if (x < 1) {
    hooks.onResult?.(false, null);
    return { isTetrahedral: false, rank: null };
  }
  // 近似 k = (6x)^(1/3)，校验 k-1..k+2
  const approx = Math.cbrt(6 * x);
  const lo = Math.max(1, Math.floor(approx) - 2);
  const hi = Math.ceil(approx) + 2;
  for (let k = lo; k <= hi; k++) {
    if (tetrahedral(k) === x) {
      hooks.onResult?.(true, k);
      return { isTetrahedral: true, rank: k };
    }
  }
  hooks.onResult?.(false, null);
  return { isTetrahedral: false, rank: null };
}
