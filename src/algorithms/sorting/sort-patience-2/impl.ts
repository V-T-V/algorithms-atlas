// =============================================================================
// 耐心排序变种（栈式合并）· 纯算法实现
// 1) 对每个元素，用二分在「各堆顶」里找最左一个 >= x 的堆（稳定）。
//    若无则开新堆；否则压入该堆。
// 2) 收集所有堆，用最小堆做 k 路归并（同值按堆内顺序稳定）。
// =============================================================================
export interface Patience2Hooks {
  onPile?: (value: number, pileIdx: number) => void;
  onNewPile?: (value: number, pileIdx: number) => void;
  onMergeStart?: (pileCount: number) => void;
  onPickTop?: (value: number, pileIdx: number) => void;
}

/** 在 top（各堆顶，升序）中找第一个 >= x 的下标；若都比 x 小返回 -1。 */
function lowerBoundGE(top: readonly number[], x: number): number {
  let l = 0;
  let r = top.length;
  while (l < r) {
    const mid = (l + r) >> 1;
    if (top[mid]! <= x)
      l = mid + 1; // 严格大于 x 才停（保证稳定：相等也压同一堆）
    else r = mid;
  }
  return l < top.length ? l : -1;
}

export function patienceSort2(arr: readonly number[], hooks: Patience2Hooks = {}): number[] {
  const piles: number[][] = [];
  const tops: number[] = [];
  for (const x of arr) {
    const idx = lowerBoundGE(tops, x);
    if (idx === -1) {
      piles.push([x]);
      tops.push(x);
      hooks.onNewPile?.(x, piles.length - 1);
    } else {
      piles[idx]!.push(x);
      tops[idx] = x;
      hooks.onPile?.(x, idx);
    }
  }
  hooks.onMergeStart?.(piles.length);

  // k 路归并：用各堆「顶部」（栈顶，即最后一个元素，因为入堆顺序自下而上）
  // 这里堆内是按入堆顺序 push 的，最后入堆的在数组末尾；归并应取堆顶=末尾。
  const result: number[] = [];
  const ptrs = piles.map((p) => p.length - 1); // 每个堆当前「顶」的下标
  while (true) {
    // 找当前堆顶最小的（同值取堆号最小，稳定）
    let best = -1;
    for (let i = 0; i < piles.length; i++) {
      if (ptrs[i]! < 0) continue;
      if (best === -1 || piles[i]![ptrs[i]!]! < piles[best]![ptrs[best]!]!) best = i;
    }
    if (best === -1) break;
    const v = piles[best]![ptrs[best]!]!;
    result.push(v);
    hooks.onPickTop?.(v, best);
    ptrs[best]!--;
  }
  return result;
}
