// =============================================================================
// 李超线段树（最大值）
// =============================================================================

export interface Line {
  k: number;
  b: number;
}

export interface LiChaoHooks {
  onInsert?: (line: Line) => void;
  onQuery?: (x: number, value: number) => void;
}

const NEG_INF_LINE: Line = { k: 0, b: -Infinity };

function evalAt(line: Line, x: number): number {
  return line.k * x + line.b;
}

export class LiChaoTree {
  /** 值域 [lo, hi] 内的整数 x */
  lo: number;
  hi: number;
  tree: Line[];
  hooks: LiChaoHooks;

  constructor(lo: number, hi: number, hooks: LiChaoHooks = {}) {
    this.lo = lo;
    this.hi = hi;
    const size = hi - lo + 1;
    this.tree = new Array(4 * Math.max(1, size)).fill(NEG_INF_LINE);
    this.hooks = hooks;
  }

  private insertNode(
    node: number,
    l: number,
    r: number,
    segL: number,
    segR: number,
    newLine: Line,
  ): void {
    if (segL > r || segR < l) return;
    const mid = (l + r) >> 1;
    if (segL <= l && r <= segR) {
      const cur = this.tree[node]!;
      const newMid = evalAt(newLine, mid);
      const curMid = evalAt(cur, mid);
      if (newMid > curMid) {
        // 在中点 newLine 占优，交换
        this.tree[node] = newLine;
        if (l === r) return;
        // 把旧的 cur 下沉到一侧
        this.insertNode(node * 2, l, mid, l, mid, cur);
        this.insertNode(node * 2 + 1, mid + 1, r, mid + 1, r, cur);
      } else {
        if (l === r) return;
        // newLine 在 l 处是否优于 cur
        const newL = evalAt(newLine, l);
        const curL = evalAt(cur, l);
        if (newL > curL) this.insertNode(node * 2, l, mid, l, mid, newLine);
        const newR = evalAt(newLine, r);
        const curR = evalAt(cur, r);
        if (newR > curR) this.insertNode(node * 2 + 1, mid + 1, r, mid + 1, r, newLine);
      }
      return;
    }
    // 跨边界
    if (l === r) return;
    this.insertNode(node * 2, l, mid, segL, segR, newLine);
    this.insertNode(node * 2 + 1, mid + 1, r, segL, segR, newLine);
  }

  insert(line: Line, segL?: number, segR?: number): void {
    const l = segL ?? this.lo;
    const r = segR ?? this.hi;
    this.insertNode(1, this.lo, this.hi, l, r, line);
    this.hooks.onInsert?.(line);
  }

  query(x: number): number {
    let best = -Infinity;
    const go = (node: number, l: number, r: number) => {
      const cur = this.tree[node]!;
      const v = evalAt(cur, x);
      if (v > best) best = v;
      if (l === r) return;
      const mid = (l + r) >> 1;
      if (x <= mid) go(node * 2, l, mid);
      else go(node * 2 + 1, mid + 1, r);
    };
    go(1, this.lo, this.hi);
    this.hooks.onQuery?.(x, best);
    return best;
  }
}
