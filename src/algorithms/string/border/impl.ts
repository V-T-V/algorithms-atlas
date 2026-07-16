// =============================================================================
// Border 数组（Border Array）· 纯算法实现
// border[i] = pat[0..i] 的「最长真前缀 = 真后缀」的长度（前后缀不能是整个子串）。
// 即 KMP 的前缀函数 π。这里另给出「每个位置 i 的 border 长度」数组。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BorderHooks {
  /** 沿失配链回退候选长度 len。 */
  onFallback?: (i: number, from: number, to: number) => void;
  /** 确定 border[i]。 */
  onSet?: (i: number, value: number) => void;
  /** 计算完成。 */
  onDone?: (b: number[]) => void;
}

/**
 * Border 数组：`border[i]` = pat[0..i] 的最长相等「真前后缀」长度。
 *
 * 真前缀/真后缀：长度严格小于 i+1（故 border[0]=0）。
 * 等价于 KMP 前缀函数 π。性质：pat[0..i] 的所有 border 长度构成序列
 *   i+1, border[i], border[border[i]-1], ... ，递减到 0。
 *
 * 时间 O(n)，空间 O(n)。
 *
 * @returns border 数组（长度 m）
 */
export function border(pat: string, hooks: BorderHooks = {}): number[] {
  const m = pat.length;
  const b = new Array<number>(m).fill(0);
  if (m === 0) {
    hooks.onDone?.(b);
    return b;
  }
  for (let i = 1; i < m; i++) {
    let len = b[i - 1]!;
    while (len > 0 && pat[len] !== pat[i]) {
      const from = len;
      len = b[len - 1]!;
      hooks.onFallback?.(i, from, len);
    }
    if (pat[len] === pat[i]) len++;
    b[i] = len;
    hooks.onSet?.(i, len);
  }
  hooks.onDone?.(b);
  return b;
}

/**
 * 列出 pat[0..i] 的所有 border 长度（含 0，不含整个 i+1），降序。
 * 用于周期性分析、覆盖（cover）等。
 */
export function allBorders(b: number[], i: number): number[] {
  const res: number[] = [];
  let len = b[i]!;
  while (len > 0) {
    res.push(len);
    len = b[len - 1]!;
  }
  return res;
}
