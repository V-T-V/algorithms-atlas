// =============================================================================
// 李超线段树：定义域 [0, M]，支持插入直线 / 线段，查询 x 处最大值
// =============================================================================

interface Line {
  k: number;
  b: number;
}

export interface LiChaoHooks {
  onInsert?: (l: number, r: number, line: Line) => void;
  onDominate?: (x: number, value: number) => void;
  onQuery?: (x: number, value: number) => void;
}

const evalAt = (ln: Line | null, x: number): number =>
  ln === null ? Number.NEGATIVE_INFINITY : ln.k * x + ln.b;

export class LiChao3 {
  private tree: (Line | null)[];
  constructor(
    public readonly M: number,
    private hooks: LiChaoHooks = {},
  ) {
    this.tree = new Array(4 * Math.max(1, M + 1)).fill(null);
  }
  private insertNode(node: number, l: number, r: number, seg: Line): void {
    const cur = this.tree[node] ?? null;
    if (cur === null) {
      this.tree[node] = seg;
      this.hooks.onDominate?.((l + r) >> 1, evalAt(seg, (l + r) >> 1));
      return;
    }
    const mid = (l + r) >> 1;
    const segMid = evalAt(seg, mid);
    const curMid = evalAt(cur, mid);
    let dominant: Line = seg;
    let recessive: Line = cur;
    if (segMid < curMid) {
      dominant = cur;
      recessive = seg;
    }
    this.tree[node] = dominant;
    this.hooks.onDominate?.(mid, evalAt(dominant, mid));
    if (l === r) return;
    // 检查 recessive 是否在某一侧更优
    if (evalAt(recessive, l) > evalAt(dominant, l)) {
      this.insertNode(node * 2, l, mid, recessive);
    } else if (evalAt(recessive, r) > evalAt(dominant, r)) {
      this.insertNode(node * 2 + 1, mid + 1, r, recessive);
    }
  }
  /** 在区间 [ql, qr] 插入直线 y=kx+b。 */
  insert(ql: number, qr: number, k: number, b: number): void {
    this.hooks.onInsert?.(ql, qr, { k, b });
    this.insertSeg(1, 0, this.M, ql, qr, { k, b });
  }
  private insertSeg(node: number, l: number, r: number, ql: number, qr: number, seg: Line): void {
    if (qr < l || r < ql) return;
    if (ql <= l && r <= qr) {
      this.insertNode(node, l, r, seg);
      return;
    }
    const mid = (l + r) >> 1;
    this.insertSeg(node * 2, l, mid, ql, qr, seg);
    this.insertSeg(node * 2 + 1, mid + 1, r, ql, qr, seg);
  }
  /** 查询 x 处最大函数值。 */
  query(x: number): number {
    let res = Number.NEGATIVE_INFINITY;
    let node = 1;
    let l = 0;
    let r = this.M;
    while (true) {
      const ln = this.tree[node] ?? null;
      if (ln !== null) res = Math.max(res, evalAt(ln, x));
      if (l === r) break;
      const mid = (l + r) >> 1;
      if (x <= mid) {
        node = node * 2;
        r = mid;
      } else {
        node = node * 2 + 1;
        l = mid + 1;
      }
    }
    this.hooks.onQuery?.(x, res);
    return res;
  }
}
