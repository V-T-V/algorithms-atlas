// =============================================================================
// 最小覆盖子串 Minimum Window Substring · 纯算法实现
// 滑动窗口：在主串 s 中找出包含 t 所有字符（含重复）的最短子串。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MinimumWindowHooks {
  /** 右指针扩展：把 right 放进窗口。 */
  onExpand?: (left: number, right: number, ch: string) => void;
  /** 窗口已满足（覆盖 t），左指针开始收缩：把 left 收一格。 */
  onShrink?: (left: number, right: number, ch: string) => void;
  /** 找到一个候选窗口 [start, end]，记录当前最优解。 */
  onCandidate?: (start: number, end: number, len: number) => void;
  /** 完成，给出最优解起点与长度（未找到时 start=-1, len=0）。 */
  onDone?: (start: number, len: number) => void;
}

/**
 * 构造字符计数表：Map 字符 → 出现次数。
 */
export function countChars(s: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of s) m.set(c, (m.get(c) ?? 0) + 1);
  return m;
}

/**
 * 最小覆盖子串：在 `s` 中找出包含 `t` 所有字符（含重复字符）的最短连续子串。
 *
 * **滑动窗口**：维护窗口 `[left, right]` 与「窗口已含多少种 t 的字符满足需求」的计数
 * `formed`。\n
 * 1. 扩展 right：把 s[right] 加入窗口；若该字符在 t 中且窗口计数恰好达到需求，formed++\n
 * 2. 当 formed == required（窗口已覆盖 t）：\n
 *    - 记录候选 [left, right]，更新最优\n
 *    - 收缩 left：从窗口移除 s[left]；若它是 t 的需求字符且移除后窗口计数 < 需求，formed--\n
 *    - left++；继续尝试收缩直到窗口不再覆盖\n
 * 3. right 继续右移\n
 *
 * 时间 `O(|s| + |t|)`，空间 `O(|Σ|)`。
 *
 * @returns 最短覆盖子串（未找到返回 `''`）
 */
export function minimumWindow(s: string, t: string, hooks: MinimumWindowHooks = {}): string {
  if (t.length === 0 || s.length < t.length) {
    hooks.onDone?.(-1, 0);
    return '';
  }
  const need = countChars(t);
  const required = need.size; // 需要满足的不同字符种类数
  const have = new Map<string, number>(); // 窗口内各字符计数
  let formed = 0; // 已满足的种类数
  let left = 0;
  let bestStart = -1;
  let bestLen = Infinity;

  for (let right = 0; right < s.length; right++) {
    const c = s[right]!;
    hooks.onExpand?.(left, right, c);
    if (need.has(c)) {
      have.set(c, (have.get(c) ?? 0) + 1);
      if (have.get(c) === need.get(c)) formed++;
    }
    // 收缩
    while (formed === required && left <= right) {
      const len = right - left + 1;
      hooks.onCandidate?.(left, right, len);
      if (len < bestLen) {
        bestLen = len;
        bestStart = left;
      }
      const d = s[left]!;
      hooks.onShrink?.(left, right, d);
      if (need.has(d)) {
        if (have.get(d) === need.get(d)) formed--;
        have.set(d, (have.get(d) ?? 0) - 1);
      }
      left++;
    }
  }

  if (bestStart < 0) {
    hooks.onDone?.(-1, 0);
    return '';
  }
  hooks.onDone?.(bestStart, bestLen);
  return s.slice(bestStart, bestStart + bestLen);
}
