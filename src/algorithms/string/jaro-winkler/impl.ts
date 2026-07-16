// =============================================================================
// Jaro-Winkler 相似度 · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

import { jaro } from '../jaro/impl.ts';

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface JaroWinklerHooks {
  /** 算出公共前缀长度 prefixLen（上限 4）。 */
  onPrefix?: (prefixLen: number) => void;
  /** 确定基础 Jaro 相似度。 */
  onJaro?: (j: number) => void;
  /** 计算完成，给出 Jaro-Winkler 相似度（0~1）。 */
  onDone?: (similarity: number) => void;
}

/**
 * Jaro-Winkler 相似度：在 Jaro 基础上对「公共前缀」加奖励，更偏向前缀相同的串。
 *
 * `JW = J + l·p·(1 - J)`，其中：
 * - `J` 为 Jaro 相似度
 * - `l` 为公共前缀长度（最多 4）
 * - `p` 为前缀缩放因子（默认 0.1）
 *
 * 时间 `O(n·m)`，空间 `O(n+m)`（均继承自 Jaro）。
 *
 * @returns Jaro-Winkler 相似度，范围 `[0, 1]`
 */
export function jaroWinkler(a: string, b: string, hooks: JaroWinklerHooks = {}, p = 0.1): number {
  const j = jaro(a, b);
  hooks.onJaro?.(j);

  // 公共前缀长度（最多 4）
  const maxPrefix = Math.min(4, a.length, b.length);
  let prefixLen = 0;
  for (let i = 0; i < maxPrefix; i++) {
    if (a[i] === b[i]) prefixLen++;
    else break;
  }
  hooks.onPrefix?.(prefixLen);

  const similarity = j + prefixLen * p * (1 - j);
  hooks.onDone?.(similarity);
  return similarity;
}
