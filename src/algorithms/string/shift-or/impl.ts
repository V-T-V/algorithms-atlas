// =============================================================================
// Shift-Or 匹配（位并行补码形式）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ShiftOrHooks {
  /** 读入文本第 i 个字符，更新后的状态 D。 */
  onChar?: (i: number, ch: string, D: number) => void;
  /** 命中一次完整匹配（结束下标 i）。 */
  onFound?: (end: number) => void;
  /** 计算完成。 */
  onDone?: (starts: number[]) => void;
}

/**
 * Shift-Or：Shift-And 的补码形式（用 0 表示「匹配」，1 表示「不匹配」）。
 *
 * - mask[ch] 的位 i = 0 表示 pat[i] === ch，1 表示 pat[i] !== ch
 * - 初值 D = 全 1（尚无任何前缀匹配）
 * - 每步：D = (D << 1) | mask[ch]
 *   - 左移：把「前 k 位匹配」推进到「前 k+1 位」；最低位移入 0
 *   - | mask[ch]：仅在 pat[i]===ch 处保持 0，其余强制为 1
 * - D 的第 m-1 位为 0 → 命中（起点 = i - m + 1）
 *
 * 限制：模式长度 m <= 32。
 * 时间 O(n)，空间 O(|Σ|)。
 *
 * @returns 所有匹配起点下标（升序）
 */
export function shiftOr(text: string, pat: string, hooks: ShiftOrHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];
  if (m > 32) return naiveMatch(text, pat);

  // mask[ch]：位 i 为 0 表示 pat[i]===ch，1 表示 pat[i]!==ch（全 1 为初值）
  const ALL = 0xffffffff;
  const mask: Record<number, number> = {};
  for (let i = 0; i < m; i++) {
    const code = pat.charCodeAt(i);
    if (mask[code] === undefined) mask[code] = ALL;
    mask[code] &= ~(1 << i);
  }

  const result: number[] = [];
  let D = ALL; // 初始：无任何前缀匹配（全 1）
  const hit = 1 << (m - 1);
  for (let i = 0; i < n; i++) {
    const code = text.charCodeAt(i);
    D = ((D << 1) | (mask[code] ?? ALL)) >>> 0; // 保持无符号
    hooks.onChar?.(i, text[i]!, D);
    if ((D & hit) === 0) {
      const start = i - m + 1;
      hooks.onFound?.(i);
      result.push(start);
    }
  }
  hooks.onDone?.(result);
  return result;
}

function naiveMatch(text: string, pat: string): number[] {
  const n = text.length;
  const m = pat.length;
  const res: number[] = [];
  for (let s = 0; s <= n - m; s++) {
    if (text.slice(s, s + m) === pat) res.push(s);
  }
  return res;
}
