// =============================================================================
// Dota2 参议院（Dota2 Senate）· 纯算法实现
// 双队列模拟：每轮下标小者发言，禁对方队首，自身 +n 重新入队。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface Dota2SenateHooks {
  /** 某参议员（阵营、原始下标）发言，禁掉对方某成员。 */
  onBan?: (speaker: 'R' | 'D', speakerIdx: number, bannedIdx: number) => void;
  /** 结论。 */
  onConclude?: (winner: 'Radiant' | 'Dire') => void;
}

/**
 * Dota2 参议院：求获胜方。
 *
 * @param senate 仅含 'R'/'D' 的字符串
 * @param hooks 可选事件钩子
 */
export function dota2Senate(senate: string, hooks: Dota2SenateHooks = {}): 'Radiant' | 'Dire' {
  const n = senate.length;
  const rq: number[] = [];
  const dq: number[] = [];
  for (let i = 0; i < n; i++) {
    if (senate[i] === 'R') rq.push(i);
    else dq.push(i);
  }
  while (rq.length > 0 && dq.length > 0) {
    const r = rq.shift()!;
    const d = dq.shift()!;
    if (r < d) {
      // R 先发言，禁 D（下标 d）
      hooks.onBan?.('R', r, d);
      rq.push(r + n);
    } else {
      // D 先发言，禁 R（下标 r）
      hooks.onBan?.('D', d, r);
      dq.push(d + n);
    }
  }
  const winner: 'Radiant' | 'Dire' = rq.length > 0 ? 'Radiant' : 'Dire';
  hooks.onConclude?.(winner);
  return winner;
}
