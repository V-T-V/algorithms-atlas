// =============================================================================
// 灯泡开关 · 纯算法实现
// =============================================================================

export interface BulbSwitcherHooks {
  onRound?: (round: number, onCount: number) => void;
}

/** 数学解：floor(sqrt(n))。 */
export function bulbSwitch(n: number, _hooks: BulbSwitcherHooks = {}): number {
  if (n < 0) throw new Error(`n 必须 >= 0 / must be >= 0, got ${n}`);
  const result = Math.floor(Math.sqrt(n));
  return result;
}

/** 模拟解（验证用，O(n^2)）。返回每轮亮灯数序列。 */
export function bulbSwitchSimulate(n: number, hooks: BulbSwitcherHooks = {}): number {
  if (n <= 0) return 0;
  const bulbs = new Array<boolean>(n).fill(false);
  for (let round = 1; round <= n; round++) {
    for (let i = round; i <= n; i += round) {
      bulbs[i - 1] = !bulbs[i - 1]!;
    }
    let onCount = 0;
    for (const b of bulbs) if (b) onCount++;
    hooks.onRound?.(round, onCount);
  }
  let final = 0;
  for (const b of bulbs) if (b) final++;
  return final;
}
