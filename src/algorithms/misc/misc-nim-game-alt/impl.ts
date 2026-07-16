// =============================================================================
// Nim 游戏变种 · 纯算法实现
// =============================================================================

export interface NimAltHooks {
  onMove?: (player: number, stones: number, remaining: number) => void;
}

/** 判断先手是否必胜。 */
export function canWinNim(n: number, maxTake: number = 3): boolean {
  if (maxTake < 1) throw new Error(`maxTake 必须 >= 1 / must be >= 1, got ${maxTake}`);
  return n % (maxTake + 1) !== 0;
}

/** 模拟一局对弈：先手用必胜策略，返回胜者(1/2)与步骤。 */
export function playNim(
  n: number,
  maxTake: number = 3,
  hooks: NimAltHooks = {},
): { winner: number; moves: Array<{ player: number; stones: number; remaining: number }> } {
  const moves: Array<{ player: number; stones: number; remaining: number }> = [];
  let remaining = n;
  let player = 1;
  while (remaining > 0) {
    let take: number;
    if (remaining % (maxTake + 1) !== 0) {
      // 必胜：取使得剩余为 (maxTake+1) 的倍数
      take = remaining % (maxTake + 1);
    } else {
      // 必败局面，随便取 1 个
      take = 1;
    }
    take = Math.min(take, remaining);
    remaining -= take;
    moves.push({ player, stones: take, remaining });
    hooks.onMove?.(player, take, remaining);
    player = player === 1 ? 2 : 1;
  }
  // 最后取石子的人获胜
  const winner = moves.length > 0 ? moves[moves.length - 1]!.player : 0;
  return { winner, moves };
}
