// =============================================================================
// 石子游戏 VI · 纯算法实现 (LeetCode 1686)
// 按 aliceValues[i]+bobValues[i] 降序轮流取，比较最终得分。
// =============================================================================
export interface GameStoneGame6Hooks {
  onPick?: (player: 0 | 1, index: number, aliceVal: number, bobVal: number) => void;
  onScore?: (alice: number, bob: number) => void;
  onConclude?: (result: number) => void;
}

export function gameStoneGame6(
  aliceValues: readonly number[],
  bobValues: readonly number[],
  hooks: GameStoneGame6Hooks = {},
): number {
  const n = aliceValues.length;
  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((a, b) => aliceValues[b]! + bobValues[b]! - (aliceValues[a]! + bobValues[a]!));

  let alice = 0;
  let bob = 0;
  order.forEach((idx, turn) => {
    if (turn % 2 === 0) {
      // Alice
      alice += aliceValues[idx]!;
      hooks.onPick?.(0, idx, aliceValues[idx]!, bobValues[idx]!);
    } else {
      bob += bobValues[idx]!;
      hooks.onPick?.(1, idx, aliceValues[idx]!, bobValues[idx]!);
    }
    hooks.onScore?.(alice, bob);
  });

  let result: number;
  if (alice > bob) result = 1;
  else if (alice === bob) result = 0;
  else result = -1;
  hooks.onConclude?.(result);
  return result;
}
