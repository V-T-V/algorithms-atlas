// =============================================================================
// 模平方根 Tonelli–Shanks (Modular Sqrt) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ModSqrtHooks {
  /** 把 p−1 写成 q·2ᵏ 的形式。 */
  onDecompose?: (q: number, k: number) => void;
  /** 找到一个二次非剩余 z（阶为 2ᵏ）。 */
  onNonResidue?: (z: number) => void;
  /** 找到一个平方根候选 r（满足 r² ≡ n mod p）。 */
  onCandidate?: (r: number) => void;
  /** 最终结果：r 或 null（无解）。 */
  onResult?: (r: number | null) => void;
}

/**
 * 模平方根（Tonelli–Shanks 算法）：求 `x` 使 `x² ≡ n (mod p)`，
 * 其中 `p` 为**奇素数**。返回一个解；另一个是 `p − r`。
 *
 * 原理：\n- 把 `p − 1 = q · 2ᵏ` 分解\n- 找一个二次非剩余 `z`，令 `c = zᵠ`\n- 维护 `r = n^((q+1)/2)`、`t = nᵠ`、`M = k`\n- 反复尝试使 `t = 1`：找最小的 `i` 使 `t^(2ⁱ) = 1`，更新 `r ← r·c^(2^(M−i−1))`，`t ← t·c^(2^(M−i))`，`M ← i`\n\n用 BigInt 保证大数精确。
 *
 * - 时间 `O(log² p)`
 * - 空间 `O(1)`
 *
 * @param n 被开方数（≥0）
 * @param p 奇素数
 * @param hooks 可选的事件钩子
 * @returns `r` 满足 `r² ≡ n (mod p)`，`0 ≤ r < p`；若 `n` 是二次非剩余返回 `null`
 */
export function modSqrt(n: number, p: number, hooks: ModSqrtHooks = {}): number | null {
  if (!Number.isInteger(p) || p < 2) throw new RangeError('modSqrt: p must be a prime >= 2');
  const P = BigInt(p);
  const N = BigInt(((n % p) + p) % p);

  // 特例
  if (N % P === 0n) {
    hooks.onResult?.(0);
    return 0;
  }
  if (p === 2) {
    hooks.onResult?.(Number(N));
    return Number(N);
  }

  // 用欧拉判据：n^((p-1)/2) mod p
  const pow = (base: bigint, exp: bigint, m: bigint): bigint => {
    let r = 1n % m;
    let b = ((base % m) + m) % m;
    let e = exp;
    while (e > 0n) {
      if (e & 1n) r = (r * b) % m;
      e >>= 1n;
      b = (b * b) % m;
    }
    return r;
  };

  if (pow(N, (P - 1n) / 2n, P) !== 1n) {
    hooks.onResult?.(null);
    return null; // 非剩余
  }

  // p ≡ 3 mod 4：直接 r = n^((p+1)/4)
  if (p % 4 === 3) {
    const r = pow(N, (P + 1n) / 4n, P);
    hooks.onCandidate?.(Number(r));
    hooks.onResult?.(Number(r));
    return Number(r);
  }

  // 一般情形：Tonelli–Shanks
  // 分解 p-1 = q · 2^k
  let q = P - 1n;
  let k = 0n;
  while ((q & 1n) === 0n) {
    q >>= 1n;
    k++;
  }
  hooks.onDecompose?.(Number(q), Number(k));

  // 找二次非剩余 z
  let z = 2n;
  while (pow(z, (P - 1n) / 2n, P) !== P - 1n) z++;
  hooks.onNonResidue?.(Number(z));

  let M = k;
  let c = pow(z, q, P);
  let t = pow(N, q, P);
  let r = pow(N, (q + 1n) / 2n, P);

  while (t !== 1n) {
    // 找最小的 i (0 < i < M) 使 t^(2^i) = 1
    let i = 0n;
    let tmp = t;
    while (tmp !== 1n) {
      tmp = (tmp * tmp) % P;
      i++;
      if (i >= M) break; // 安全
    }
    const b = pow(c, 1n << (M - i - 1n), P);
    M = i;
    c = (b * b) % P;
    t = (t * c) % P;
    r = (r * b) % P;
  }

  hooks.onCandidate?.(Number(r));
  hooks.onResult?.(Number(r));
  return Number(r);
}
