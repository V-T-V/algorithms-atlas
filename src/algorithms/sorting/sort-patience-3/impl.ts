// 耐心排序（多牌堆）· 纯算法实现
export interface Patience3Hooks {
  onPile?: (pileCount: number, arr: number[]) => void;
}

export function patienceSort3(arr: readonly number[], hooks: Patience3Hooks = {}): number[] {
  const piles: number[][] = [];
  for (const v of arr) {
    let placed = false;
    for (const p of piles) {
      if (p[p.length - 1]! >= v) {
        p.push(v);
        placed = true;
        break;
      }
    }
    if (!placed) piles.push([v]);
    hooks.onPile?.(piles.length, [v]);
  }
  // k 路归并：每轮找最小堆顶
  const out: number[] = [];
  while (piles.some((p) => p.length > 0)) {
    let bi = -1;
    for (let i = 0; i < piles.length; i++) {
      if (
        piles[i]!.length > 0 &&
        (bi < 0 || piles[i]![piles[i]!.length - 1]! < piles[bi]![piles[bi]!.length - 1]!)
      )
        bi = i;
    }
    out.push(piles[bi]!.pop()!);
  }
  return out;
}
