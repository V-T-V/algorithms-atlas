// =============================================================================
// 递减数字分割串（Split into Fibonacci Sequence）· 纯算法实现
// 枚举前两项长度，再贪心生成后续并匹配。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface SplitStringDescHooks {
  /** 尝试以 first/second 作为前两项。 */
  onTryFirstTwo?: (first: number, second: number) => void;
  /** 贪心生成下一项 next。 */
  onGenerate?: (next: number, built: number[]) => void;
  /** 结论。 */
  onConclude?: (seq: number[]) => void;
}

export interface SsdResult {
  /** 斐波那契式序列（段数 >=3）；不存在为空。 */
  sequence: number[];
  /** 是否找到。 */
  found: boolean;
}

const MAX_VAL = Math.pow(2, 31) - 1; // LeetCode 限制每项 <= 2^31 - 1

/**
 * 把数字串拆成斐波那契式序列。
 *
 * @param num 数字字符串
 * @param hooks 可选事件钩子
 */
export function splitStringDesc(num: string, hooks: SplitStringDescHooks = {}): SsdResult {
  const n = num.length;

  // 尝试第一段长度 iLen、第二段长度 jLen
  for (let iLen = 1; iLen < n; iLen++) {
    for (let jLen = 1; iLen + jLen < n; jLen++) {
      const seg1 = num.slice(0, iLen);
      const seg2 = num.slice(iLen, iLen + jLen);
      // 前导零检查
      if ((seg1.length > 1 && seg1[0] === '0') || (seg2.length > 1 && seg2[0] === '0')) {
        continue;
      }
      // 数值超限检查
      const first = Number(seg1);
      const second = Number(seg2);
      if (first > MAX_VAL || second > MAX_VAL) continue;
      hooks.onTryFirstTwo?.(first, second);

      // 贪心生成并匹配
      const seq: number[] = [first, second];
      let pos = iLen + jLen;
      let ok = true;
      while (pos < n) {
        const next = seq[seq.length - 1]! + seq[seq.length - 2]!;
        if (next > MAX_VAL) {
          ok = false;
          break;
        }
        const nextStr = String(next);
        if (num.startsWith(nextStr, pos)) {
          seq.push(next);
          hooks.onGenerate?.(next, [...seq]);
          pos += nextStr.length;
        } else {
          ok = false;
          break;
        }
      }
      if (ok && seq.length >= 3) {
        hooks.onConclude?.(seq);
        return { sequence: seq, found: true };
      }
    }
  }
  hooks.onConclude?.([]);
  return { sequence: [], found: false };
}
