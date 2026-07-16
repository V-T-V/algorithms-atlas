// =============================================================================
// 李超树（Li Chao Segment Tree）· 纯算法实现（零 DOM 依赖）
// 维护一组直线 y = m·x + b，在整数 x 域 [XLO, XHI] 上支持：
//   - 插入一条直线
//   - 查询某 x 处所有直线中的最大值（也可改成最小值，符号翻转即可）
// 关键：在值域区间上线段树分段，每节点保留"在该区间中点更优"的那条线。
// =============================================================================

/** 一次函数 y = m·x + b。 */
export interface Line {
  m: number;
  b: number;
}

/** 事件钩子（全可选）。 */
export interface LiChaoHooks {
  /** 进入一条新直线时。 */
  onInsert?: (line: Line) => void;
  /** 在节点 [l,r] 上比较两条线、决定保留/下放时。 */
  onCompare?: (l: number, r: number, kept: Line, dropped: Line, mid: number) => void;
  /** 一次 query 的访问节点。 */
  onQueryStep?: (l: number, r: number, candidate: Line | null, x: number, best: number) => void;
}

/** 把"无直线"用一个 m=0, b=−∞ 的哨兵表示（求最大值场景下永远垫底）。 */
const NEG_INF: Line = { m: 0, b: -Infinity };

/**
 * 李超线段树（求最大值版本）。
 *
 * 原理：两条直线在区间 [l, r] 上要么一上一下（无交叉或交点在区间外），
 * 要么在中点 mid 处可判定"谁更优"。在节点上保留"在中点 mid 更优"的直线，
 * 把另一条直线递归下放到它"可能在端点更优"的那一侧子节点。
 *
 * 因为只有一条候选直线被保留在每个节点，查询 x 时只需沿 O(log W) 个节点取 max。
 *
 * **复杂度**：插入 O(log W)，查询 O(log W)，其中 W = XHI − XLO + 1。
 * 注意定义域需先离散化为整数区间。
 */
export class LiChaoTree {
  private lines: Line[];
  private readonly lo: number;
  private readonly hi: number;

  constructor(
    /** x 域下界（整数）。 */
    lo: number,
    /** x 域上界（整数）。 */
    hi: number,
    private hooks: LiChaoHooks = {},
  ) {
    if (lo > hi) throw new Error('li-chao: lo > hi');
    this.lo = lo;
    this.hi = hi;
    // 节点数上界 ≈ 4 * 区间长；编号 1 起
    const size = 4 * (hi - lo + 1);
    this.lines = new Array(size).fill(null).map(() => ({ ...NEG_INF }));
  }

  private evalAt(line: Line, x: number): number {
    return line.m * x + line.b;
  }

  /**
   * 把直线 newLine 插入到覆盖区间 [l, r] 的节点 idx 上。
   * 经典 Li Chao：保证节点上保留"mid 处更优"的那条；另一条下放到它可能反超的子区间。
   */
  private insertLine(idx: number, l: number, r: number, newLine: Line): void {
    const cur = this.lines[idx]!;

    if (l === r) {
      if (newLine.m * l + newLine.b > cur.m * l + cur.b) this.lines[idx] = { ...newLine };
      return;
    }

    const mid = (l + r) >> 1;
    const newAtMid = newLine.m * mid + newLine.b;
    const curAtMid = cur.m * mid + cur.b;

    // 让节点保留 mid 处更优者；dropped 是另一条
    let dropped: Line;
    if (newAtMid > curAtMid) {
      this.lines[idx] = { ...newLine };
      this.hooks.onCompare?.(l, r, newLine, cur, mid);
      dropped = cur;
    } else {
      this.hooks.onCompare?.(l, r, cur, newLine, mid);
      dropped = newLine;
    }
    // dropped 在 mid 较差，但可能在 [l, mid] 或 [mid+1, r] 反超
    // 用左端点 l 判定：若 dropped 在 l 更优，则交点在左半，下放左；否则下放右
    const droppedAtL = dropped.m * l + dropped.b;
    const keptAtL = this.lines[idx]!.m * l + this.lines[idx]!.b;
    const leftSon = idx * 2;
    const rightSon = idx * 2 + 1;
    if (droppedAtL > keptAtL) {
      this.insertLine(leftSon, l, mid, dropped);
    } else {
      this.insertLine(rightSon, mid + 1, r, dropped);
    }
  }

  /** 公开：插入一条直线。 */
  insert(line: Line): void {
    this.hooks.onInsert?.(line);
    this.insertLine(1, this.lo, this.hi, line);
  }

  /** 查询 x 处所有直线的最大值。 */
  query(x: number): number {
    let best = -Infinity;
    let bestLine: Line | null = null;
    const walk = (idx: number, l: number, r: number): void => {
      const cur = this.lines[idx]!;
      if (cur && cur.b !== -Infinity) {
        const v = this.evalAt(cur, x);
        if (v > best) {
          best = v;
          bestLine = cur;
        }
        this.hooks.onQueryStep?.(l, r, cur, x, best);
      }
      if (l === r) return;
      const mid = (l + r) >> 1;
      if (x <= mid) walk(idx * 2, l, mid);
      else walk(idx * 2 + 1, mid + 1, r);
    };
    walk(1, this.lo, this.hi);
    return bestLine ? best : -Infinity;
  }
}

/**
 * 便捷封装：插入一组直线，查询一组 x 的最大值。
 */
export function liChao(
  lo: number,
  hi: number,
  lines: ReadonlyArray<Line>,
  queries: readonly number[],
  hooks: LiChaoHooks = {},
): number[] {
  const tree = new LiChaoTree(lo, hi, hooks);
  for (const ln of lines) tree.insert(ln);
  return queries.map((x) => tree.query(x));
}
