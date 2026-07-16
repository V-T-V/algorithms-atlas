// =============================================================================
// 失配函数（Failure Function / KMP 前缀函数 π）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FailureFunctionHooks {
  /** j 回退（沿失配链）到新位置。 */
  onFallback?: (i: number, fromJ: number, toJ: number) => void;
  /** 确定 failure[i] 的值。 */
  onSet?: (i: number, value: number) => void;
  /** 计算完成。 */
  onDone?: (fail: number[]) => void;
}

/**
 * 失配函数（前缀函数 π）：`fail[i]` = pat[0..i] 的「最长相等前后缀」长度，
 * 其中前后缀都不能是整个子串 pat[0..i]（故 fail[0]=0）。
 *
 * 这是 KMP 的核心：当在位置 i 失配时，模式可对齐到 fail[i-1] 继续，不回退文本指针。
 *
 * 算法：维护 `len`（当前最长相等前后缀长度），逐位扩展——\n
 * - 若 pat[len]===pat[i]：len++，fail[i]=len\n
 * - 否则若 len>0：len = fail[len-1]（沿失配链回退，不前进 i），重试\n
 * - 否则：fail[i]=0，前进 i\n
 *
 * 时间 O(n)，空间 O(n)。
 *
 * @returns 失配函数数组 fail（长度 m）
 */
export function failureFunction(pat: string, hooks: FailureFunctionHooks = {}): number[] {
  const m = pat.length;
  const fail = new Array<number>(m).fill(0);
  if (m === 0) {
    hooks.onDone?.(fail);
    return fail;
  }
  let len = 0;
  let i = 1;
  while (i < m) {
    if (pat[len] === pat[i]) {
      len++;
      fail[i] = len;
      hooks.onSet?.(i, len);
      i++;
    } else if (len > 0) {
      const from = len;
      len = fail[len - 1]!;
      hooks.onFallback?.(i, from, len);
    } else {
      fail[i] = 0;
      hooks.onSet?.(i, 0);
      i++;
    }
  }
  hooks.onDone?.(fail);
  return fail;
}
