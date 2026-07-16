// =============================================================================
// 最大唯一字符拼接 · 纯算法实现 (LeetCode 1239)
// 位掩码去重，回溯选/不选。
// =============================================================================
export interface BtMaxLengthUniqueCharsHooks {
  onTry?: (index: number, include: boolean, feasible: boolean) => void;
  onBest?: (length: number) => void;
}

/** 把字符串转为 26 位掩码；若自身含重复字符返回 null。 */
function toMask(s: string): number | null {
  let m = 0;
  for (const ch of s) {
    const bit = 1 << (ch.charCodeAt(0) - 97);
    if (m & bit) return null; // 自身重复
    m |= bit;
  }
  return m;
}

export function btMaxLengthUniqueChars(
  arr: readonly string[],
  hooks: BtMaxLengthUniqueCharsHooks = {},
): number {
  const masks = arr.map(toMask);
  let best = 0;

  const backtrack = (i: number, used: number, len: number): void => {
    if (i === arr.length) {
      if (len > best) {
        best = len;
        hooks.onBest?.(best);
      }
      return;
    }
    // 不选 i
    backtrack(i + 1, used, len);
    // 选 i（若自身无重复且与 used 无冲突）
    if (masks[i] !== null && (used & masks[i]!) === 0) {
      hooks.onTry?.(i, true, true);
      backtrack(i + 1, used | masks[i]!, len + arr[i]!.length);
    } else {
      hooks.onTry?.(i, true, false);
    }
  };

  backtrack(0, 0, 0);
  return best;
}
