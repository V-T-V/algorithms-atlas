// =============================================================================
// 合作博弈（Shapley 值）· 纯算法实现
// v: 以联盟位掩码为键的价值函数。求每个玩家的 Shapley 值。
// =============================================================================
export interface GameCooperativeHooks {
  onCoalition?: (order: number[], marginal: number, player: number) => void;
  onShapley?: (player: number, value: number) => void;
}

export function gameCooperative(
  playerCount: number,
  v: (coalitionMask: number) => number,
  hooks: GameCooperativeHooks = {},
): number[] {
  const players = Array.from({ length: playerCount }, (_, i) => i);
  const shapley = new Array<number>(playerCount).fill(0);
  let permCount = 0;

  const permute = (arr: number[], k: number): void => {
    if (k === arr.length) {
      permCount++;
      let coalition = 0;
      for (const p of arr) {
        const before = coalition;
        coalition |= 1 << p;
        const marginal = v(coalition) - v(before);
        hooks.onCoalition?.([...arr], marginal, p);
        shapley[p]! += marginal;
      }
      return;
    }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i]!, arr[k]!];
      permute(arr, k + 1);
      [arr[k], arr[i]] = [arr[i]!, arr[k]!];
    }
  };

  permute(players, 0);

  for (let i = 0; i < playerCount; i++) {
    shapley[i]! /= permCount;
    hooks.onShapley?.(i, shapley[i]!);
  }
  return shapley;
}
