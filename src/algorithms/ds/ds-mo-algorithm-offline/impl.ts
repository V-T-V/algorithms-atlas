// =============================================================================
// Mo 算法（离线区间查询）· 纯算法实现
// 演示：静态区间不同元素个数（distinct count）。
// =============================================================================

export interface MoHooks {
  onSort?: (order: number[]) => void;
  onMoveL?: (L: number, dir: -1 | 1) => void;
  onMoveR?: (R: number, dir: -1 | 1) => void;
  onAnswer?: (qi: number, l: number, r: number, ans: number) => void;
}

export interface MoQuery {
  l: number;
  r: number; // 含两端
}

/**
 * Mo 算法：返回每个查询的答案（区间不同元素个数）。
 * @param arr 数据数组（元素会被映射到 0..maxVal）
 * @param queries 查询列表
 */
export function moDistinctCount(arr: number[], queries: MoQuery[], hooks: MoHooks = {}): number[] {
  const n = arr.length;
  const q = queries.length;
  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));

  // 排序：块号升序，块内 r 按奇偶升/降（优化指针移动）
  const order = Array.from({ length: q }, (_, i) => i);
  order.sort((a, b) => {
    const ba = Math.floor(queries[a]!.l / blockSize);
    const bb = Math.floor(queries[b]!.l / blockSize);
    if (ba !== bb) return ba - bb;
    return ba % 2 === 0 ? queries[a]!.r - queries[b]!.r : queries[b]!.r - queries[a]!.r;
  });
  hooks.onSort?.(order);

  // 离散化
  const sorted = [...arr].sort((a, b) => a - b);
  const rank = new Map<number, number>();
  let rid = 0;
  for (const v of sorted) {
    if (!rank.has(v)) rank.set(v, rid++);
  }
  const freq = new Array<number>(rid).fill(0);
  let distinct = 0;

  const ans = new Array<number>(q).fill(0);
  let L = 0;
  let R = -1; // 空区间

  const add = (idx: number): void => {
    const r = rank.get(arr[idx]!)!;
    if (freq[r] === 0) distinct++;
    freq[r]!++;
  };
  const remove = (idx: number): void => {
    const r = rank.get(arr[idx]!)!;
    freq[r]!--;
    if (freq[r] === 0) distinct--;
  };

  for (let i = 0; i < q; i++) {
    const qi = order[i]!;
    const { l, r } = queries[qi]!;
    while (L > l) {
      L--;
      add(L);
      hooks.onMoveL?.(L, -1);
    }
    while (R < r) {
      R++;
      add(R);
      hooks.onMoveR?.(R, 1);
    }
    while (L < l) {
      remove(L);
      hooks.onMoveL?.(L, 1);
      L++;
    }
    while (R > r) {
      remove(R);
      hooks.onMoveR?.(R, -1);
      R--;
    }
    ans[qi] = distinct;
    hooks.onAnswer?.(qi, l, r, distinct);
  }
  return ans;
}
