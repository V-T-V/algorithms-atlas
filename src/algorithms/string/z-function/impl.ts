// =============================================================================
// Z 函数 Z-Function · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface ZFunctionHooks {
  /** 维护的「Z-box」右端最远的区间 [l, r]。每轮可能更新。 */
  onBox?: (l: number, r: number) => void;
  /** 比较 s[i] 与 s[i - l]（与对应前缀字符）。equal 表示是否相等。 */
  onCompare?: (i: number, prefixIdx: number, equal: boolean) => void;
  /** 确定了 z[i] 的值。 */
  onSetZ?: (i: number, value: number) => void;
}

/**
 * Z 函数：对串 `s` 求每个位置 `i` 的 `z[i]`。
 *
 * `z[i]` = `s` 与 `s[i..]` 的最长公共前缀长度。约定 `z[0] = 0`
 * （整串与自身比较无意义；调用方若需要可置 `z[0] = n`）。
 *
 * 用「Z-box」`[l, r]`（已知与某前缀匹配的最远右段）做线性算法：
 * - `i > r` 或 `z[i-l] >= r-i+1` 时，从 `max(i, r+1)` 起逐字扩展
 * - 否则 `z[i] = z[i-l]`，直接复用
 * - 扩展后若新区间右端更远则更新 `[l, r]`
 *
 * 时间 `O(n)`，空间 `O(n)`。`z[0] = 0`。
 *
 * @returns Z 数组（长度 = s.length）
 */
export function zFunction(s: string, hooks: ZFunctionHooks = {}): number[] {
  const n = s.length;
  const z = new Array<number>(n).fill(0);
  if (n === 0) return z;
  // z[0] = 0 by convention
  hooks.onSetZ?.(0, 0);

  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i <= r) {
      // 在 Z-box 内，可复用前缀信息
      const init = Math.min(z[i - l]!, r - i + 1);
      z[i] = init;
    }
    // 尝试向右扩展
    while (i + z[i]! < n && s[z[i]!] === s[i + z[i]!]) {
      const prefixIdx = z[i]!;
      hooks.onCompare?.(i + prefixIdx, prefixIdx, true);
      z[i]!++;
    }
    if (i + z[i]! - 1 > r) {
      l = i;
      r = i + z[i]! - 1;
      hooks.onBox?.(l, r);
    }
    hooks.onSetZ?.(i, z[i]!);
  }
  return z;
}
