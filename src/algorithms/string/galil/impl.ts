// =============================================================================
// Galil 匹配（KMP + Galil 优化）· 纯算法实现
// 在 KMP 基础上利用模式周期性：当模式有周期 p 时，连续窗口的「前 p 个字符」无需重复比较，
// 只需比较剩余 m-p 个字符，把最坏复杂度从 O(n·m) 降到严格 O(n+m)。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

import { failureFunction } from '../failure-function/impl.ts';

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GalilHooks {
  /** 模式对齐到文本起点 s。 */
  onAlign?: (s: number) => void;
  /** 比较 text[s+j] 与 pat[j]。 */
  onCompare?: (s: number, j: number, match: boolean) => void;
  /** 命中一次完整匹配（起点 s）。 */
  onFound?: (s: number) => void;
  /** KMP 失配回退：j 从 fromJ 移到 toJ。 */
  onShift?: (s: number, fromJ: number, toJ: number) => void;
}

/**
 * Galil 优化的 KMP：在 text 中找出所有 pat 出现的起点下标。
 *
 * 关键：模式最短周期 p = m - lps[m-1]（lps 为前缀函数）。\n
 * - 当 m % p === 0（模式确有周期 p）：连续两次匹配只相差 p 位，前 p 个字符在上一轮已验证，
 *   本轮只比较 pat[p..m-1] 段，避免重复工作 → 严格线性。\n
 * - 否则退化为标准 KMP（仍 O(n+m) 均摊）。
 *
 * 时间 O(n+m)，空间 O(m)。
 *
 * @returns 所有匹配起点下标（升序）。空模式返回 []。
 */
export function galil(text: string, pat: string, hooks: GalilHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];

  const lps = failureFunction(pat);
  const period = m - lps[m - 1]!; // 最短周期
  const isPeriodic = m % period === 0 && period < m;

  const result: number[] = [];
  let s = 0; // 当前窗口起点
  let i = 0; // 文本指针（绝对下标）
  let j = 0; // 模式指针
  // Galil：已确认的前缀长度（周期内已比较过的部分，下一窗口可跳过）
  let galilStart = 0; // 本轮从 j=galilStart 起比较（跳过已验证前缀）

  hooks.onAlign?.(s);

  while (i < n) {
    // 利用 galil 跳过：若 galilStart>0，跳过前 galilStart 个
    while (j < m && i < n && pat[j] === text[i]) {
      hooks.onCompare?.(s, j, true);
      i++;
      j++;
    }
    if (j === m) {
      hooks.onFound?.(s);
      result.push(s);
    } else if (j > galilStart) {
      // 至少比较过一次（且 j>0）
      hooks.onCompare?.(s, j, false);
    }
    if (j === m) {
      // 完整匹配后：周期性记忆
      if (isPeriodic) {
        galilStart = m - period; // 下一窗口跳过前 m-period 个（已验证）
      } else {
        galilStart = 0;
      }
      j = lps[m - 1]!;
      s = i - j;
      hooks.onShift?.(s, m, j);
      hooks.onAlign?.(s);
    } else if (j === 0) {
      galilStart = 0;
      i++;
      s = i;
      hooks.onAlign?.(s);
    } else {
      const fromJ = j;
      j = lps[j - 1]!;
      // 跳过的部分若 <= galilStart，直接补到 galilStart
      if (j < galilStart) {
        i += galilStart - j;
        j = galilStart;
      }
      galilStart = 0;
      s = i - j;
      hooks.onShift?.(s, fromJ, j);
      hooks.onAlign?.(s);
    }
  }
  return result;
}
