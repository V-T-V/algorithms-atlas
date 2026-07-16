// =============================================================================
// LIS 线段树（值域最大线段树）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 思路：把元素值离散化到 [1..m]，用线段树维护「以某值结尾的 LIS 最大长度」，
// 转移 dp[v] = 1 + 区间 [1..v-1] 的最大值，单点更新。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface LisSegmentHooks {
  /** 处理元素 a[i]，其离散化后的值域编号 rid。 */
  onVisit?: (i: number, val: number, rid: number) => void;
  /** 查询区间 [1, rid-1] 的最大 dp 值 bestPrev。 */
  onQuery?: (rid: number, bestPrev: number) => void;
  /** 单点 rid 更新为新 dp 值 dpv。 */
  onUpdate?: (rid: number, dpv: number) => void;
  /** 算法完成：LIS 长度。 */
  onDone?: (length: number) => void;
}

/** 单点更新、区间最大值的线段树（动态大小 n，1-based 下标）。 */
class MaxSegTree {
  private readonly n: number;
  private readonly tree: number[];
  constructor(n: number) {
    this.n = n;
    this.tree = new Array<number>(4 * Math.max(n, 1)).fill(0);
  }
  /** 查询区间 [l, r] 的最大值（1-based, 闭区间）。 */
  query(l: number, r: number): number {
    if (l > r) return 0;
    return this.q(1, 1, this.n, l, r);
  }
  private q(node: number, nl: number, nr: number, l: number, r: number): number {
    if (l <= nl && nr <= r) return this.tree[node]!;
    const mid = (nl + nr) >> 1;
    let best = 0;
    if (l <= mid) best = Math.max(best, this.q(node * 2, nl, mid, l, r));
    if (r > mid) best = Math.max(best, this.q(node * 2 + 1, mid + 1, nr, l, r));
    return best;
  }
  /** 单点 pos 更新为 val（取 max）。 */
  update(pos: number, val: number): void {
    this.u(1, 1, this.n, pos, val);
  }
  private u(node: number, nl: number, nr: number, pos: number, val: number): void {
    if (nl === nr) {
      this.tree[node] = Math.max(this.tree[node]!, val);
      return;
    }
    const mid = (nl + nr) >> 1;
    if (pos <= mid) this.u(node * 2, nl, mid, pos, val);
    else this.u(node * 2 + 1, mid + 1, nr, pos, val);
    this.tree[node] = Math.max(this.tree[node * 2]!, this.tree[node * 2 + 1]!);
  }
}

/**
 * 最长严格递增子序列（值域线段树版，O(n log n)）。
 *
 * - 把所有元素值离散化到 `1..m`（严格递增需去重）\n- 线段树下标 = 值，节点维护「以该值结尾的 LIS 长度」\n- 对 `a[i]`（离散值 `rid`）：`dp = 1 + query(1, rid-1)`，再 `update(rid, dp)`\n- 答案 = 全局最大\n *
 * 时间 `O(n log n)`，空间 `O(n)`。该写法便于推广到「带权 LIS」「二维偏序」等。
 *
 * @param arr 数值数组
 * @returns LIS 长度
 */
export function lisSegment(arr: readonly number[], hooks: LisSegmentHooks = {}): number {
  const n = arr.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  // 离散化（去重，严格递增）
  const sorted = [...new Set(arr)].sort((a, b) => a - b);
  const rankOf = new Map<number, number>();
  sorted.forEach((v, idx) => rankOf.set(v, idx + 1)); // 1-based
  const m = sorted.length;

  const seg = new MaxSegTree(m);
  let best = 0;
  for (let i = 0; i < n; i++) {
    const x = arr[i]!;
    const rid = rankOf.get(x)!;
    hooks.onVisit?.(i, x, rid);
    const prev = seg.query(1, rid - 1);
    hooks.onQuery?.(rid, prev);
    const dp = prev + 1;
    seg.update(rid, dp);
    hooks.onUpdate?.(rid, dp);
    if (dp > best) best = dp;
  }

  hooks.onDone?.(best);
  return best;
}
