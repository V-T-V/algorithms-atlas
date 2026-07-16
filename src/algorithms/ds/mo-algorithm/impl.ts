// =============================================================================
// 莫队算法 Mo's Algorithm · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 实现：离线区间查询框架。把查询按「块号（l/√n），同块按 r 排序」重排，
//   再用一个可增删维护的「游标区间」[curL, curR]，通过 ±1 平移来回答每个查询。
//   - 每次平移调用 add(idx) / del(idx) 增删元素，O(1) 维护答案。
//   - 总平移次数 O((n+q)√n)。
//   - 本实现演示「区间不同元素个数」作为可维护聚合。
// =============================================================================

/** 莫队操作过程中的事件钩子。任一可选。 */
export interface MoHooks {
  /** 排序完成，给出查询的新顺序（原下标数组）。 */
  onSort?: (order: number[]) => void;
  /** 游标平移一步：新区间 [curL, curR]，刚 add/del 的下标 idx，op='+1'|'-1'。 */
  onMove?: (curL: number, curR: number, idx: number, op: '+1' | '-1') => void;
  /** 回答一个查询：原查询下标 qi，区间 [l, r]，答案。 */
  onAnswer?: (qi: number, l: number, r: number, answer: number) => void;
}

/** 单个区间查询（0-based 闭区间）。 */
export interface MoQuery {
  l: number;
  r: number;
}

/** 聚合状态：维护「区间内不同元素个数」。 */
class DistinctCounter {
  private freq: Map<number, number> = new Map();
  distinct = 0;

  add(value: number): void {
    const c = this.freq.get(value) ?? 0;
    if (c === 0) this.distinct++;
    this.freq.set(value, c + 1);
  }

  del(value: number): void {
    const c = (this.freq.get(value) ?? 0) - 1;
    if (c === 0) {
      this.distinct--;
      this.freq.delete(value);
    } else {
      this.freq.set(value, c);
    }
  }
}

/**
 * 莫队算法（离线区间查询）。
 * @param arr 原数组
 * @param queries 查询列表（0-based 闭区间）
 * @param hooks 事件钩子
 * @returns 与 queries 同序的答案数组（区间不同元素个数）
 */
export function moAlgorithm(
  arr: readonly number[],
  queries: readonly MoQuery[],
  hooks: MoHooks = {},
): number[] {
  const n = arr.length;
  const q = queries.length;
  const answers = new Array<number>(q).fill(0);
  if (q === 0) return answers;

  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
  // 查询原下标按莫队排序
  const order = queries.map((_, i) => i);
  order.sort((a, b) => {
    const qa = queries[a]!;
    const qb = queries[b]!;
    const ba = Math.floor(qa.l / blockSize);
    const bb = Math.floor(qb.l / blockSize);
    if (ba !== bb) return ba - bb;
    // 同块：偶数块 r 升序，奇数块 r 降序（优化）
    return ba % 2 === 0 ? qa.r - qb.r : qb.r - qa.r;
  });
  hooks.onSort?.(order);

  const counter = new DistinctCounter();
  let curL = 0;
  let curR = -1; // 初始空区间

  for (const qi of order) {
    const { l, r } = queries[qi]!;
    // 平移游标，注意顺序避免 del 空区间
    while (curL > l) {
      curL--;
      counter.add(arr[curL]!);
      hooks.onMove?.(curL, curR, curL, '+1');
    }
    while (curR < r) {
      curR++;
      counter.add(arr[curR]!);
      hooks.onMove?.(curL, curR, curR, '+1');
    }
    while (curL < l) {
      counter.del(arr[curL]!);
      hooks.onMove?.(curL, curR, curL, '-1');
      curL++;
    }
    while (curR > r) {
      counter.del(arr[curR]!);
      hooks.onMove?.(curL, curR, curR, '-1');
      curR--;
    }
    answers[qi] = counter.distinct;
    hooks.onAnswer?.(qi, l, r, counter.distinct);
  }
  return answers;
}

/** 暴力求区间不同元素个数（用于交叉验证）。 */
export function bruteDistinct(arr: readonly number[], l: number, r: number): number {
  const set = new Set<number>();
  for (let i = l; i <= r; i++) set.add(arr[i]!);
  return set.size;
}
