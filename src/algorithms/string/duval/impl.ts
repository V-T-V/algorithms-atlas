// =============================================================================
// Duval 分解（Lyndon 词分解）· 纯算法实现
// 把字符串唯一地分解成若干「字典序非递增」的 Lyndon 词：s = w1 w2 ... wk，
// 每个 wi 是 Lyndon 词（严格小于其所有真循环移位），且 w1 >= w2 >= ... >= wk。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 一个 Lyndon 因子：内容 + 在原串中的 [start, end) 区间。 */
export interface LyndonFactor {
  text: string;
  start: number;
  end: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DuvalHooks {
  /** 确定一个 Lyndon 因子。 */
  onFactor?: (factor: LyndonFactor) => void;
  /** 计算完成。 */
  onDone?: (factors: LyndonFactor[]) => void;
}

/**
 * Duval 算法：把字符串分解成 Lyndon 词序列（Chen-Fox-Lyndon 分解）。
 *
 * 维护双指针 i（因子起点）、j（扫描指针）、k（候选周期内位置）：
 * - 比较 s[j] 与 s[k]：
 *   - s[j] > s[k]：当前 s[i..j] 是 Lyndon 词，输出，i = j+1（重置）
 *   - s[j] < s[k]：s[i..j] 不是 Lyndon，回退到上一个因子边界
 *   - s[j] === s[k]：继续（周期性扩展）
 * - 用周期 (j-k+1) 处理重复段
 *
 * 时间 O(n)，空间 O(因子数)。
 *
 * @returns Lyndon 因子序列（按出现顺序，字典序非递增）
 */
export function duval(s: string, hooks: DuvalHooks = {}): LyndonFactor[] {
  const n = s.length;
  const factors: LyndonFactor[] = [];
  let i = 0;
  while (i < n) {
    let j = i + 1;
    let k = i;
    while (j < n && s[j] !== undefined && s[k] !== undefined && s[j]! >= s[k]!) {
      if (s[j]! > s[k]!) {
        j++;
        k = i;
      } else {
        // s[j] === s[k]：周期内推进
        j++;
        k++;
      }
    }
    // 现在 s[i..j] 由若干相同周期段组成；k-i+1 是周期长度
    // 输出所有完整周期段
    const period = j - k;
    while (i <= k) {
      const end = i + period;
      const factor: LyndonFactor = {
        text: s.slice(i, Math.min(end, n)),
        start: i,
        end: Math.min(end, n),
      };
      factors.push(factor);
      hooks.onFactor?.(factor);
      i = end;
    }
  }
  hooks.onDone?.(factors);
  return factors;
}
