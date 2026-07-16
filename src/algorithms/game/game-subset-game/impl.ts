// =============================================================================
// 子集游戏 (Subtraction Game) · 纯算法实现
// 可取数量集合 S，求每堆 SG，多堆异或。
// =============================================================================
export interface GameSubsetGameHooks {
  onSg?: (size: number, sg: number) => void;
  onHeapXor?: (heapIndex: number, sg: number) => void;
  onConclude?: (firstWins: boolean) => void;
}

export function gameSubsetGame(
  piles: readonly number[],
  removable: readonly number[],
  hooks: GameSubsetGameHooks = {},
): number {
  const maxPile = piles.reduce((a, b) => Math.max(a, b), 0);
  const sg = new Array<number>(maxPile + 1).fill(0);
  for (let x = 1; x <= maxPile; x++) {
    const seen = new Set<number>();
    for (const s of removable) {
      if (s <= x) seen.add(sg[x - s]!);
    }
    let m = 0;
    while (seen.has(m)) m++;
    sg[x]! = m;
    hooks.onSg?.(x, m);
  }
  let xorSum = 0;
  piles.forEach((p, i) => {
    xorSum ^= sg[p]!;
    hooks.onHeapXor?.(i, sg[p]!);
  });
  hooks.onConclude?.(xorSum !== 0);
  return xorSum;
}
