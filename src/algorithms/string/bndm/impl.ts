// =============================================================================
// BNDM 匹配（位并行反向匹配）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BndmHooks {
  /** 模式对齐到文本窗口起点 pos。 */
  onAlign?: (pos: number) => void;
  /** 从右向左扫描时，更新位掩码状态 d。 */
  onScan?: (pos: number, i: number, d: number) => void;
  /** 命中一次完整匹配（起点）。 */
  onFound?: (start: number) => void;
  /** 窗口整体滑动 step 位。 */
  onShift?: (pos: number, newPos: number, step: number) => void;
}

/**
 * BNDM（Backward Non-deterministic Dawg Matching）：位并行、从右向左匹配。
 *
 * - 预处理：字符掩码 B[c]，bit k 置位当且仅当 pat[m-1-k] === c（反向位序）
 * - 搜索：窗口 j，d 初始全 1；i 从 m-1 向左递减：
 *   `d &= B[text[j+i]]`；若 d≠0，记录 `last = i`（潜在前缀起点）；
 *   当 i 减到 -1 仍 d≠0 → 完整匹配，输出 j
 *   每次 `d <<= 1`
 * - 窗口右移 `last`（最长已匹配前缀长度），保证不漏匹配
 *
 * 限制：模式长度 m <= 32（JS number 安全位宽）。
 * 时间平均次线性，最坏 O(n·m)。
 *
 * @returns 所有匹配起点下标（升序）
 */
export function bndm(text: string, pat: string, hooks: BndmHooks = {}): number[] {
  const n = text.length;
  const m = pat.length;
  if (m === 0 || m > n) return [];
  if (m > 32) return naiveMatch(text, pat);

  // 反向位序掩码：bit k 表示 pat[m-1-k] === c
  const mask: Record<number, number> = {};
  let s = 1;
  for (let i = m - 1; i >= 0; i--) {
    const code = pat.charCodeAt(i);
    mask[code] = (mask[code] ?? 0) | s;
    s <<= 1;
  }

  const result: number[] = [];
  let pos = 0;
  hooks.onAlign?.(pos);

  while (pos <= n - m) {
    let i = m - 1;
    let last = m;
    let d = (0xffffffff >>> (32 - m)) | 0; // 低 m 位全 1
    if (m === 32) d = -1;
    while (i >= 0 && d !== 0) {
      const code = text.charCodeAt(pos + i);
      d &= mask[code] ?? 0;
      i--;
      if (d !== 0) {
        if (i >= 0) {
          last = i + 1;
        } else {
          hooks.onFound?.(pos);
          result.push(pos);
        }
      }
      d <<= 1;
      hooks.onScan?.(pos, i + 1, d);
    }
    const newPos = pos + last;
    hooks.onShift?.(pos, newPos, last);
    pos = newPos;
  }
  return result;
}

function naiveMatch(text: string, pat: string): number[] {
  const n = text.length;
  const m = pat.length;
  const res: number[] = [];
  for (let s = 0; s <= n - m; s++) {
    if (text.slice(s, s + m) === pat) res.push(s);
  }
  return res;
}
