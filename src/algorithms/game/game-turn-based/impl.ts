// =============================================================================
// 回合制游戏框架 · 纯算法实现
// 通用 minimax：状态用剩余石子数表示，动作 1..maxTake，取最后一颗者胜。
// isMaxPlayer 视角：True 表示当前玩家希望最大化（赢）。
// =============================================================================
export interface GameTurnBasedHooks {
  onMove?: (remaining: number, take: number) => void;
  onBacktrack?: (remaining: number, take: number) => void;
  onMemo?: (remaining: number, winning: boolean) => void;
}

/** 求剩余 remaining 颗、当前玩家是否必胜（每轮取 1..maxTake，取最后一颗者胜）。 */
export function gameTurnBased(
  remaining: number,
  maxTake: number,
  hooks: GameTurnBasedHooks = {},
): boolean {
  // win[r] = 还剩 r 颗且轮到当前玩家时，当前玩家是否必胜
  const win = new Array<boolean>(remaining + 1).fill(false);
  win[0] = false; // 没石子可取 → 当前玩家输（上一位取走了最后一颗）
  for (let r = 1; r <= remaining; r++) {
    let canWin = false;
    for (let take = 1; take <= Math.min(maxTake, r); take++) {
      hooks.onMove?.(r, take);
      // 取走 take 后剩 r-take，轮到对手；若对手在 r-take 必败则当前必胜
      if (!win[r - take]!) {
        canWin = true;
        break;
      }
      hooks.onBacktrack?.(r, take);
    }
    win[r]! = canWin;
    hooks.onMemo?.(r, canWin);
  }
  return win[remaining]!;
}
