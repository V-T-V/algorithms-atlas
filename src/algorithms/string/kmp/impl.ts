// =============================================================================
// KMP 模式匹配 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface KmpHooks {
  /** 构造失败指针数组（lps/next）时，回退 j。 */
  onBuildLps?: (i: number, j: number) => void;
  /** 确定了 lps[i] 的值。 */
  onSetLps?: (i: number, value: number) => void;
  /** 文本指针 i、模式指针 j 当前字符相等（推进）。 */
  onMatch?: (i: number, j: number) => void;
  /** 文本指针 i、模式指针 j 当前字符不等。 */
  onMismatch?: (i: number, j: number) => void;
  /** j>0 时失配：用 lps 把 j 左移到新位置（避免回退 i）。 */
  onShift?: (i: number, fromJ: number, toJ: number) => void;
  /** 在文本下标 i 处完整匹配到模式（结束位置 i = 起点 + m - 1）。 */
  onFound?: (i: number) => void;
}

/**
 * 构造模式串的失败指针数组 `lps`（即前缀函数 π）。
 *
 * `lps[j]` = 模式串 `pat[0..j]` 的「最长相等前后缀」长度（前后缀都不能是整个串）。
 * 也常写作 next 数组。KMP 用它在失配时把模式指针回跳，而不是回退文本指针。
 *
 * 时间 `O(m)`，空间 `O(m)`。
 */
export function buildLps(pat: string, hooks: KmpHooks = {}): number[] {
  const m = pat.length;
  const lps = new Array<number>(m).fill(0);
  let len = 0; // 当前最长相等前后缀长度
  let i = 1;
  while (i < m) {
    if (pat[i] === pat[len]) {
      len++;
      lps[i] = len;
      hooks.onSetLps?.(i, len);
      i++;
    } else if (len > 0) {
      hooks.onBuildLps?.(i, len);
      len = lps[len - 1]!; // 回退到更短的前缀
    } else {
      lps[i] = 0;
      hooks.onSetLps?.(i, 0);
      i++;
    }
  }
  return lps;
}

/**
 * KMP 字符串匹配：在 `text` 中找出所有 `pat` 出现的起点下标。
 *
 * - 先对模式串构造 `lps`（`O(m)`）
 * - 扫描文本：`i` 仅递增不回退；当 `text[i] === pat[j]` 时双双前进；
 *   失配时若 `j>0` 则 `j = lps[j-1]`，否则 `i++`
 * - `j` 达到 `m` 即命中一次完整匹配，记录起点 `i - m`，并令 `j = lps[j-1]` 继续找后续
 *
 * 时间 `O(n + m)`，空间 `O(m)`。
 *
 * @returns 所有匹配起点下标（升序）。空模式返回 `[]`。
 */
export function kmp(text: string, pat: string, hooks: KmpHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  const lps = buildLps(pat, hooks);

  const result: number[] = [];
  let i = 0; // 文本指针
  let j = 0; // 模式指针
  while (i < n) {
    if (text[i] === pat[j]) {
      hooks.onMatch?.(i, j);
      i++;
      j++;
      if (j === m) {
        const start = i - m;
        hooks.onFound?.(i - 1);
        result.push(start);
        j = lps[j - 1]!; // 继续寻找后续匹配
      }
    } else {
      hooks.onMismatch?.(i, j);
      if (j > 0) {
        const from = j;
        j = lps[j - 1]!;
        hooks.onShift?.(i, from, j);
      } else {
        i++;
      }
    }
  }
  return result;
}
