// =============================================================================
// 字符串最小字典序旋转（Booth 算法）· 纯算法实现
// =============================================================================

export interface BoothHooks {
  /** 当前候选起点 k。 */
  onCandidate?: (k: number) => void;
  /** 比较 s+s[i] 与 s+s[j]。cmp: -1 表示 i 小，0 等，1 表示 j 小。 */
  onCompare?: (i: number, j: number, cmp: number) => void;
  /** 失败指针 f[j-k] 更新。 */
  onFail?: (idx: number, value: number) => void;
  onResult?: (k: number) => void;
}

/**
 * Booth 算法：在 s+s 上运行类似 KMP 的失败函数，
 * 维护当前最小旋转起点 k，O(n) 求出最小字典序旋转。
 * 返回使 rotate(s, k) = s[k..]+s[..k] 字典序最小的 k（落在 [0,n)）。
 */
export function minLexRotation(s: string, hooks: BoothHooks = {}): number {
  const n = s.length;
  if (n === 0) return 0;
  const ss = s + s;
  const len = ss.length;
  const f = new Array<number>(len).fill(-1);
  let k = 0;
  hooks.onCandidate?.(k);
  for (let j = 1; j < len; j++) {
    let i = f[j - k - 1]!;
    const sj = ss.charCodeAt(j);
    while (i !== -1) {
      const si = ss.charCodeAt(k + i + 1);
      const cmp = sj === si ? 0 : sj < si ? -1 : 1;
      hooks.onCompare?.(k + i + 1, j, cmp);
      if (cmp !== 0) {
        // sj != si
        if (cmp < 0) {
          // sj < si：j 起点更优，切换候选
          k = j - i - 1;
          hooks.onCandidate?.(k);
        }
        i = f[i]!;
      } else {
        break;
      }
    }
    if (i === -1) {
      const si = ss.charCodeAt(k); // 即 k + i + 1 = k + 0
      const cmp = sj === si ? 0 : sj < si ? -1 : 1;
      hooks.onCompare?.(k, j, cmp);
      if (cmp !== 0) {
        if (cmp < 0) {
          k = j;
          hooks.onCandidate?.(k);
        }
        f[j - k] = -1;
      } else {
        f[j - k] = 0;
      }
      hooks.onFail?.(j - k, f[j - k]!);
    } else {
      f[j - k] = i + 1;
      hooks.onFail?.(j - k, i + 1);
    }
  }
  // k 可能落在 [0, 2n)，规约到 [0, n)
  if (k >= n) k -= n;
  hooks.onResult?.(k);
  return k;
}

/** 返回最小字典序旋转串。 */
export function minLexRotated(s: string): string {
  if (s.length === 0) return '';
  const k = minLexRotation(s);
  return s.slice(k) + s.slice(0, k);
}
