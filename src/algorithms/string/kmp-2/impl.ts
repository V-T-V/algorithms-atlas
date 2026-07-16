// =============================================================================
// KMP（next 数组变体）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Kmp2Hooks {
  /** 构造 next 数组时确定 next[i]。 */
  onSetNext?: (i: number, value: number) => void;
  /** 比较文本 i 与模式 j：equal 表示是否相等。 */
  onCompare?: (i: number, j: number, equal: boolean) => void;
  /** j 利用 next 回跳。 */
  onJump?: (i: number, fromJ: number, toJ: number) => void;
  /** 命中一次完整匹配（起点）。 */
  onFound?: (start: number) => void;
}

/**
 * 构造 next 数组（长度 m+1）：next[j] 表示当比较到模式第 j 位失配时（或匹配完 m 位后），
 * 模式应回退到的下标。next[0] = -1（哨兵）。这相当于把前缀函数右移一位。
 *
 * 时间 O(m)，空间 O(m+1)。
 */
export function buildNext(pat: string, hooks: Kmp2Hooks = {}): number[] {
  const m = pat.length;
  const next = new Array<number>(m + 1).fill(0);
  if (m === 0) return next;
  next[0] = -1;
  let i = 0;
  let j = -1;
  while (i < m) {
    if (j === -1 || pat[i] === pat[j]) {
      i++;
      j++;
      next[i] = j;
      hooks.onSetNext?.(i, j);
    } else {
      j = next[j]!;
    }
  }
  return next;
}

/**
 * KMP 匹配（next 数组变体）：在 text 中找出所有 pat 出现的起点下标。
 *
 * - i 遍历文本不回退；j 为模式指针
 * - 相等则 i、j 各 +1；j 达到 m 即命中，记录 i - m，j 回退到 next[j]（用长度 m+1 的 next 正确处理重叠）
 * - 失配：j = next[j]（若 j = -1 则 i++、j = 0）
 *
 * 时间 O(n + m)，空间 O(m)。
 *
 * @returns 所有匹配起点下标（升序）
 */
export function kmp2(text: string, pat: string, hooks: Kmp2Hooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];
  const next = buildNext(pat, hooks);
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < n) {
    const equal = j === -1 || text[i] === pat[j];
    hooks.onCompare?.(i, j, equal);
    if (equal) {
      i++;
      j++;
      if (j === m) {
        const start = i - m;
        hooks.onFound?.(start);
        result.push(start);
        j = next[j]!;
      }
    } else {
      const from = j;
      j = next[j]!;
      hooks.onJump?.(i, from, j);
    }
  }
  return result;
}
