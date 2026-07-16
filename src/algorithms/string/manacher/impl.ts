// =============================================================================
// Manacher 最长回文子串（Manacher Palindrome）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ManacherHooks {
  /** 当前处理中心位置 center，其臂长（半径）已被确定为 radius。 */
  onExpand?: (center: number, radius: number, matched: boolean) => void;
  /** 发现当前臂长超过了已知最大值，更新「全局最长回文」。 */
  onUpdateMax?: (center: number, radius: number, length: number) => void;
  /** 当前中心无法继续扩展（左右字符不等或越界）。 */
  onMismatch?: (center: number, radius: number) => void;
  /** 算法完成：给出最长回文子串的起点（在原串中）与长度。 */
  onDone?: (start: number, length: number) => void;
}

/**
 * Manacher 算法：求字符串 s 的最长回文子串，并返回每个变换串位置的回文半径。
 *
 * 原理：先把串改造成「#a#b#c#」形式（用分隔符隔开每个字符，首尾也加），这样所有
 * 回文都变成奇数长，中心唯一。维护：
 *   - `rad[i]`：以变换串位置 i 为中心的最长回文半径（含中心）
 *   - 当前已覆盖最右边界 `right` 与其中心 `center`
 * 利用回文的对称性：`rad[i]` 初值取 `rad[mirror]` 与 `right - i` 的较小值，再尝试向两侧扩展。
 *
 * @param s 原始字符串
 * @returns `rad` 数组（对应变换串 `#` 分隔形式），`rad[i]` = 以变换位置 i 为中心的回文半径。
 *          注意：原串中以字符为奇数中心，半径 r 对应原串回文长 `r-1` 的字符数级联……
 *          最长回文长度 = `max(rad) - 1`。
 */
export function manacher(s: string, hooks: ManacherHooks = {}): number[] {
  const n = s.length;
  if (n === 0) {
    hooks.onDone?.(0, 0);
    return [];
  }

  // 构造变换串：# s[0] # s[1] # ... # s[n-1] #
  const t: string[] = new Array<string>(2 * n + 1).fill('#');
  for (let i = 0; i < n; i++) t[2 * i + 1] = s[i]!;
  const m = t.length;

  const rad = new Array<number>(m).fill(0);
  let center = 0; // 当前覆盖最右边界的回文中心
  let right = 0; // 最右边界（含）
  let maxRad = 0; // 全局最大半径
  let maxCenter = 0;

  for (let i = 0; i < m; i++) {
    // 利用对称性给一个较优初值
    let r = 1;
    if (i <= right) {
      const mirror = 2 * center - i;
      r = Math.min(rad[mirror]!, right - i + 1);
    }

    // 尝试扩展
    while (i - r >= 0 && i + r < m && t[i - r] === t[i + r]) {
      hooks.onExpand?.(i, r, true);
      r++;
    }
    r--; // 最后一次扩展失败，回退
    rad[i] = r;

    if (i + r > right) {
      right = i + r;
      center = i;
    }
    if (rad[i - 1] !== undefined && rad[i - 1]! < rad[i]!) {
      // 仅记录扩展事件
    }
    if (r > maxRad) {
      maxRad = r;
      maxCenter = i;
      const len = r; // 变换半径 = 原串回文长度
      hooks.onUpdateMax?.(i, r, len);
    }
    if (r < 1 + (i <= right ? right - i : 0)) {
      hooks.onMismatch?.(i, r);
    }
  }

  const start = (maxCenter - maxRad) / 2; // 映射回原串起点
  hooks.onDone?.(start, maxRad);
  return rad;
}

/**
 * 便捷：直接返回最长回文子串的 `{ start, length }`。
 */
export function longestPalindrome(
  s: string,
  hooks: ManacherHooks = {},
): { start: number; length: number } {
  const rad = manacher(s, hooks);
  if (s.length === 0) return { start: 0, length: 0 };
  let maxRad = 0;
  let maxCenter = 0;
  for (let i = 0; i < rad.length; i++) {
    if (rad[i]! > maxRad) {
      maxRad = rad[i]!;
      maxCenter = i;
    }
  }
  return { start: (maxCenter - maxRad) / 2, length: maxRad };
}
