// =============================================================================
// Z 函数 · 纯算法实现
// =============================================================================

export interface ZHooks {
  /** 维护的右段 [l, r]。 */
  onSegment?: (l: number, r: number) => void;
  /** 确定 Z[i] 的值。 */
  onSetZ?: (i: number, value: number) => void;
}

/** 计算 s 的 Z 数组：Z[i] = LCP(s, s[i..])。Z[0] 通常定义为 0。 */
export function computeZ(s: string, hooks: ZHooks = {}): number[] {
  const n = s.length;
  const z = new Array<number>(n).fill(0);
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]!);
    while (i + z[i]! < n && s[z[i]!] === s[i + z[i]!]) z[i]!++;
    if (i + z[i]! > r) {
      l = i;
      r = i + z[i]!;
      hooks.onSegment?.(l, r);
    }
    hooks.onSetZ?.(i, z[i]!);
  }
  return z;
}

/** 用 Z 函数在 text 中找 pattern 的所有出现位置。 */
export function zPatternSearch(text: string, pattern: string, hooks: ZHooks = {}): number[] {
  if (pattern.length === 0) return [0];
  if (pattern.length > text.length) return [];
  const combined = pattern + '\u0001' + text; // 用分隔符
  const z = computeZ(combined, hooks);
  const m = pattern.length;
  const res: number[] = [];
  for (let i = m + 1; i < combined.length; i++) {
    if (z[i]! >= m) res.push(i - m - 1);
  }
  return res;
}

/** 计数本质不同子串（在线追加字符，利用 Z）。 */
export function distinctSubstrings(s: string): number {
  let total = 0;
  for (let i = 1; i <= s.length; i++) {
    const prefix = s.slice(0, i);
    // Z of reversed-prefix: 翻转后求 Z，新增子串数 = i - max(Z)
    const rev = [...prefix].reverse().join('');
    const z = computeZ(rev);
    let maxZ = 0;
    for (let k = 1; k < z.length; k++) maxZ = Math.max(maxZ, z[k]!);
    total += i - maxZ;
  }
  return total;
}
