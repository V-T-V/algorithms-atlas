// =============================================================================
// Manacher：最长回文子串
// =============================================================================

export interface ManacherHooks {
  onExpand?: (center: number, radius: number) => void;
  onBox?: (l: number, r: number) => void;
  onDone?: (bestCenter: number, bestRadius: number) => void;
}

export interface ManacherResult {
  /** 原串中最长回文子串。 */
  palindrome: string;
  /** 起点下标（原串）。 */
  start: number;
  /** 长度。 */
  length: number;
  /** 半径数组（在变换串上）。 */
  radii: number[];
}

export function manacher(s: string, hooks: ManacherHooks = {}): ManacherResult {
  // 构造 T = ^#a#b#c#$ 形式
  const T = '^#' + s.split('').join('#') + '#$';
  const n = T.length;
  const radii = new Array<number>(n).fill(0);
  let C = 0;
  let R = 0;
  for (let i = 1; i < n - 1; i++) {
    const mirror = 2 * C - i;
    if (i < R) radii[i] = Math.min(R - i, radii[mirror]!);
    while (T[i + radii[i]! + 1] === T[i - radii[i]! - 1]) {
      radii[i] = radii[i]! + 1;
      hooks.onExpand?.(i, radii[i]!);
    }
    if (i + radii[i]! > R) {
      C = i;
      R = i + radii[i]!;
      hooks.onBox?.(2 * C - R, R);
    }
  }
  // 找最长
  let maxLen = 0;
  let centerIndex = 0;
  for (let i = 1; i < n - 1; i++) {
    if (radii[i]! > maxLen) {
      maxLen = radii[i]!;
      centerIndex = i;
    }
  }
  hooks.onDone?.(centerIndex, maxLen);
  const start = Math.floor((centerIndex - maxLen) / 2);
  const palindrome = s.slice(start, start + maxLen);
  return { palindrome, start, length: maxLen, radii };
}
