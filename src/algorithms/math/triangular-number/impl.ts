// =============================================================================
// 三角数
// T(n) = n(n+1)/2。
// 判定：x 是三角数 iff 8x+1 为完全平方数。
// =============================================================================

export interface TriangularHooks {
  onTerm?: (i: number, value: number) => void;
  onResult?: (isTriangular: boolean, rank: number | null) => void;
}

export interface TriangularResult {
  isTriangular: boolean;
  rank: number | null;
}

/** 第 n 个三角数 T(n) = n(n+1)/2。 */
export function triangular(n: number): number {
  if (n < 0) return 0;
  return (n * (n + 1)) / 2;
}

/** 生成前 n 个三角数（T(1)..T(n)）。 */
export function triangularSequence(n: number, hooks: TriangularHooks = {}): number[] {
  const seq: number[] = [];
  for (let i = 1; i <= n; i++) {
    const t = triangular(i);
    seq.push(t);
    hooks.onTerm?.(i, t);
  }
  return seq;
}

/** 判定 x 是否为三角数；若是返回其排名（第 k 个）。 */
export function isTriangular(x: number, hooks: TriangularHooks = {}): TriangularResult {
  if (x < 1) {
    hooks.onResult?.(false, null);
    return { isTriangular: false, rank: null };
  }
  const disc = 8 * x + 1;
  const r = Math.sqrt(disc);
  if (!Number.isInteger(r) || r * r !== disc) {
    hooks.onResult?.(false, null);
    return { isTriangular: false, rank: null };
  }
  // k = (r - 1) / 2，须为正整数
  if ((r - 1) % 2 !== 0) {
    hooks.onResult?.(false, null);
    return { isTriangular: false, rank: null };
  }
  const k = (r - 1) / 2;
  hooks.onResult?.(true, k);
  return { isTriangular: true, rank: k };
}
