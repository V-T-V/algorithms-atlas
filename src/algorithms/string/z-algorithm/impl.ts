// =============================================================================
// Z 算法（Z Algorithm）· 纯算法实现
// 线性时间构造 Z 数组。零 DOM 依赖，可独立单测。
// =============================================================================

export interface ZAlgorithmHooks {
  /** 更新 Z-box 到 [L, R]。 */
  onZBox?: (L: number, R: number) => void;
  /** 确定 z[i]。 */
  onSet?: (i: number, value: number) => void;
  /** 从头暴力比较扩展位置 i。 */
  onExtend?: (i: number, fromLen: number, toLen: number) => void;
}

/**
 * 计算 Z 数组：z[i] = s 与 s[i..] 的最长公共前缀长度；z[0] = 0。
 * 时间 O(n)，空间 O(n)。
 */
export function zAlgorithm(s: string, hooks: ZAlgorithmHooks = {}): number[] {
  const n = s.length;
  const z = new Array<number>(n).fill(0);
  if (n === 0) return z;

  let L = 0;
  let R = 0;
  for (let i = 1; i < n; i++) {
    if (i <= R) {
      // 初值：min(z[i-L], R-i+1)
      z[i] = Math.min(z[i - L]!, R - i + 1);
    }
    const fromLen = z[i]!;
    // 向右扩展
    while (i + z[i]! < n && s[z[i]!] === s[i + z[i]!]) {
      z[i]!++;
    }
    if (z[i]! > fromLen) hooks.onExtend?.(i, fromLen, z[i]!);

    // 更新 Z-box
    if (i + z[i]! - 1 > R) {
      L = i;
      R = i + z[i]! - 1;
      hooks.onZBox?.(L, R);
    }
    hooks.onSet?.(i, z[i]!);
  }
  return z;
}

/**
 * 用 Z 算法做模式匹配：返回 pat 在 txt 中所有出现的起点。
 * 构造 pat + "#" + txt 的 Z 数组，z[i] == |pat| 即匹配。
 * 时间 O(n + m)，空间 O(n + m)。
 */
export function zSearch(txt: string, pat: string, hooks: ZAlgorithmHooks = {}): number[] {
  const combined = `${pat}#${txt}`;
  const z = zAlgorithm(combined, hooks);
  const m = pat.length;
  const matches: number[] = [];
  for (let i = m + 1; i < combined.length; i++) {
    if (z[i] === m) matches.push(i - m - 1);
  }
  return matches;
}
