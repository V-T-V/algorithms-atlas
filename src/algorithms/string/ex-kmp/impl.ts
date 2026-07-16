// =============================================================================
// 扩展 KMP（Z 函数）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ExKmpHooks {
  /** 维护「最右匹配区间」[l, r]，r 为右端点。 */
  onBox?: (l: number, r: number) => void;
  /** 确定 z[i] 的值。 */
  onSetZ?: (i: number, value: number) => void;
  /** 计算完成，给出 z 数组。 */
  onDone?: (z: number[]) => void;
}

/**
 * Z 函数：`z[i]` = 从 `s[i]` 起与 `s` 自身的最长公共前缀长度（`z[0]` 习惯上为 0 或 n）。
 *
 * 利用「最右匹配区间 `[l, r]`」加速：当 `i <= r` 时，`z[i]` 至少为
 * `min(z[i-l], r-i+1)`，再向右逐字符扩展。
 *
 * 时间 `O(n)`，空间 `O(n)`。
 *
 * @returns z 数组（`z[0]` 设为 0）
 */
export function zFunction(s: string, hooks: ExKmpHooks = {}): number[] {
  const n = s.length;
  const z = new Array<number>(n).fill(0);
  if (n === 0) {
    hooks.onDone?.(z);
    return z;
  }
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]!);
    while (i + (z[i] ?? 0) < n && s[z[i] ?? 0] === s[i + (z[i] ?? 0)]) z[i] = (z[i] ?? 0) + 1;
    const zi = z[i] ?? 0;
    if (i + zi - 1 > r) {
      l = i;
      r = i + zi - 1;
      hooks.onBox?.(l, r);
    }
    hooks.onSetZ?.(i, zi);
  }
  hooks.onDone?.(z);
  return z;
}

/**
 * 扩展 KMP：对每个文本位置 i，求 `text[i..]` 与 `pat` 的最长公共前缀长度 `ext[i]`。
 *
 * 做法：对 `pat + '#' + text` 求 Z 函数，`ext[i] = z[m+1+i]`（`#` 为分隔符保证不越界）。
 *
 * 时间 `O(n + m)`，空间 `O(n + m)`。
 *
 * @returns ext 数组：`ext[i]` = text[i..] 与 pat 的 LCP 长度；`ext[i] === m` 即命中
 */
export function exKmp(text: string, pat: string, hooks: ExKmpHooks = {}): number[] {
  const m = pat.length;
  if (m === 0) return [];
  const sep = '#';
  const z = zFunction(pat + sep + text, hooks);
  const ext: number[] = [];
  for (let i = m + 1; i < z.length; i++) ext.push(z[i]!);
  return ext;
}
