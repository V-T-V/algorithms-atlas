// =============================================================================
// Jaro 相似度 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface JaroHooks {
  /** 匹配窗口半径确定为 matchWindow（`floor(max(|a|,|b|)/2) - 1`）。 */
  onWindow?: (matchWindow: number) => void;
  /** 在 a[i] 与 b 的窗口内匹配到 b[j]。 */
  onMatch?: (i: number, j: number) => void;
  /** 统计完匹配后，确定换位数 transpositions（半值）。 */
  onTranspositions?: (transpositions: number) => void;
  /** 计算完成，给出 Jaro 相似度（0~1）。 */
  onDone?: (similarity: number) => void;
}

/**
 * Jaro 相似度：衡量两个字符串的相似程度，返回 `[0, 1]`（1 = 完全相同）。
 *
 * - 匹配窗口 `w = floor(max(|a|,|b|)/2) - 1`，a[i] 只能与 b 中 `[i-w, i+w]` 内未匹配字符匹配
 * - 数出匹配数 `m`（每个字符只匹配一次）；`m=0` → 相似度 0
 * - 在匹配字符中数「顺序不一致」的对数，换位 = transpositions/2
 * - 相似度 = `(1/3)(m/|a| + m/|b| + (m - transpositions)/m)`
 *
 * 时间 `O(n·m)`（窗口匹配），空间 `O(n+m)`。
 *
 * @returns Jaro 相似度，范围 `[0, 1]`
 */
export function jaro(a: string, b: string, hooks: JaroHooks = {}): number {
  const la = a.length;
  const lb = b.length;
  if (la === 0 && lb === 0) {
    hooks.onDone?.(1);
    return 1;
  }
  if (la === 0 || lb === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const matchWindow = Math.max(0, Math.floor(Math.max(la, lb) / 2) - 1);
  hooks.onWindow?.(matchWindow);

  const aMatched = new Array<boolean>(la).fill(false);
  const bMatched = new Array<boolean>(lb).fill(false);
  let matches = 0;

  for (let i = 0; i < la; i++) {
    const lo = Math.max(0, i - matchWindow);
    const hi = Math.min(lb - 1, i + matchWindow);
    for (let j = lo; j <= hi; j++) {
      if (bMatched[j] || a[i] !== b[j]) continue;
      aMatched[i] = true;
      bMatched[j] = true;
      matches++;
      hooks.onMatch?.(i, j);
      break;
    }
  }

  if (matches === 0) {
    hooks.onTranspositions?.(0);
    hooks.onDone?.(0);
    return 0;
  }

  // 数换位：把两边匹配字符按顺序取出，统计不等的位置
  let k = 0;
  let transpositions = 0;
  for (let i = 0; i < la; i++) {
    if (!aMatched[i]) continue;
    while (!bMatched[k]) k++;
    if (a[i] !== b[k]) transpositions++;
    k++;
  }
  transpositions >>= 1; // 每个换位被数了两次
  hooks.onTranspositions?.(transpositions);

  const m = matches;
  const similarity = (m / la + m / lb + (m - transpositions) / m) / 3;
  hooks.onDone?.(similarity);
  return similarity;
}
