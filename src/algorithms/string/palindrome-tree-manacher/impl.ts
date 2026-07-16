// =============================================================================
// Manacher 回文半径 · 纯算法实现
// =============================================================================

export interface ManacherResult {
  /** 改造后的串（含分隔符）每个中心的最长回文半径。 */
  radii: number[];
  /** 原串中最长回文子串的起点。 */
  start: number;
  /** 原串中最长回文子串的长度。 */
  length: number;
}

/** 事件钩子。 */
export interface ManacherHooks {
  /** 维护的「最远右边界」中心 c 与右端 r。 */
  onBox?: (c: number, r: number) => void;
  /** 确定了中心 i 的回文半径 rad。 */
  onRadius?: (i: number, rad: number) => void;
  /** 完成。 */
  onResult?: (start: number, length: number) => void;
}

/** 把串改造为 ^#a#b#c#$ 形式，统一奇偶。 */
function transform(s: string): string {
  return '^#' + Array.from(s).join('#') + '#$';
}

/**
 * Manacher：求最长回文子串。
 */
export function manacher(s: string, hooks: ManacherHooks = {}): ManacherResult {
  const t = transform(s);
  const m = t.length;
  const radii = new Array<number>(m).fill(0);
  let c = 0;
  let r = 0; // 当前最远右边界（不含）
  let bestCenter = 0;
  let bestRad = 0;

  for (let i = 1; i < m - 1; i++) {
    const mirror = 2 * c - i;
    if (i < r) radii[i] = Math.min(r - i, radii[mirror]!);
    // 尝试扩展
    while (t[i + radii[i]!] === t[i - radii[i]!]) radii[i]!++;
    radii[i]!--; // 减去多算的越界比较
    hooks.onRadius?.(i, radii[i]!);
    if (i + radii[i]! > r) {
      r = i + radii[i]!;
      c = i;
      hooks.onBox?.(c, r);
    }
    if (radii[i]! > bestRad) {
      bestRad = radii[i]!;
      bestCenter = i;
    }
  }

  // 映射回原串
  const start = Math.floor((bestCenter - bestRad) / 2);
  const length = bestRad;
  hooks.onResult?.(start, length);
  return { radii, start, length };
}

/** 计数所有回文子串数量（利用半径数组）。 */
export function countPalindromes(s: string): number {
  const { radii } = manacher(s);
  let cnt = 0;
  for (let i = 1; i < radii.length - 1; i++) cnt += Math.floor((radii[i]! + 1) / 2);
  return cnt;
}
