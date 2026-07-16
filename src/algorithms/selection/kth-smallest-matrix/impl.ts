// 有序矩阵第 k 小 · 纯算法实现
// 用最小堆（二叉堆）维护候选，行行升序矩阵。

/** 事件钩子。 */
export interface KthMatrixHooks {
  /** 初始入堆：第一行的每个元素。 */
  onInitHeap?: (col: number) => void;
  /** 弹出最小 (row, col, value) 第 step 次。 */
  onPop?: (step: number, row: number, col: number, value: number) => void;
  /** 入堆 (row, col, value)。 */
  onPush?: (row: number, col: number, value: number) => void;
}

interface HeapNode {
  v: number;
  r: number;
  c: number;
}

/** 简单二叉最小堆（按 v 排序，平手按 r,c）。 */
class MinHeap {
  private a: HeapNode[] = [];
  size(): number {
    return this.a.length;
  }
  push(n: HeapNode): void {
    this.a.push(n);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(this.a[i]!, this.a[p]!)) {
        const t = this.a[i]!;
        this.a[i] = this.a[p]!;
        this.a[p] = t;
        i = p;
      } else break;
    }
  }
  pop(): HeapNode {
    const top = this.a[0]!;
    const last = this.a.pop()!;
    if (this.a.length > 0) {
      this.a[0] = last;
      let i = 0;
      const n = this.a.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let s = i;
        if (l < n && this.less(this.a[l]!, this.a[s]!)) s = l;
        if (r < n && this.less(this.a[r]!, this.a[s]!)) s = r;
        if (s === i) break;
        const t = this.a[i]!;
        this.a[i] = this.a[s]!;
        this.a[s] = t;
        i = s;
      }
    }
    return top;
  }

  private less(x: HeapNode, y: HeapNode): boolean {
    if (x.v !== y.v) return x.v < y.v;
    if (x.r !== y.r) return x.r < y.r;
    return x.c < y.c;
  }
}

/**
 * 在行行升序的矩阵中找第 k 小（1-based k）。
 * @param matrix n×m 矩阵，每行升序（列升序非必须，但若满足可保证正确）
 * @param k 1-based 排名
 * @param hooks 可选事件钩子
 */
export function kthSmallestMatrix(
  matrix: readonly (readonly number[])[],
  k: number,
  hooks: KthMatrixHooks = {},
): number {
  const n = matrix.length;
  if (n === 0) throw new RangeError('empty matrix');
  const m = matrix[0]!.length;
  if (k < 1 || k > n * m) throw new RangeError(`k out of range: ${k}`);

  const heap = new MinHeap();
  // 第一行整行入堆
  for (let c = 0; c < m; c++) {
    heap.push({ v: matrix[0]![c]!, r: 0, c });
    hooks.onInitHeap?.(c);
  }

  let result = matrix[0]![0]!;
  for (let step = 1; step <= k; step++) {
    const top = heap.pop();
    hooks.onPop?.(step, top.r, top.c, top.v);
    result = top.v;
    // 把正下方入堆
    if (top.r + 1 < n) {
      const nv = matrix[top.r + 1]![top.c]!;
      heap.push({ v: nv, r: top.r + 1, c: top.c });
      hooks.onPush?.(top.r + 1, top.c, nv);
    }
  }
  return result;
}
