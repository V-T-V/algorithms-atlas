// =============================================================================
// 四叉树（二维矩形区域查询）· 纯算法实现
// =============================================================================

export interface QPoint {
  x: number;
  y: number;
  value: number;
}

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number; // 含 x1, y1
}

export interface QuadHooks {
  onSplit?: (region: Rect, depth: number) => void;
  onInsert?: (point: QPoint, depth: number) => void;
  onVisit?: (region: Rect, depth: number) => void;
  onCollect?: (point: QPoint) => void;
  onFullyContained?: (region: Rect, count: number) => void;
}

const CAPACITY = 4;
const MAX_DEPTH = 8;

interface QuadNode {
  region: Rect;
  depth: number;
  points: QPoint[];
  children: [QuadNode, QuadNode, QuadNode, QuadNode] | null; // NW, NE, SW, SE
}

export class QuadTree {
  private root: QuadNode;
  private hooks: QuadHooks;

  constructor(region: Rect, hooks: QuadHooks = {}) {
    this.hooks = hooks;
    this.root = { region, depth: 0, points: [], children: null };
  }

  insert(p: QPoint): void {
    this.insertRec(this.root, p);
  }

  private insertRec(node: QuadNode, p: QPoint): void {
    if (node.children === null) {
      node.points.push(p);
      this.hooks.onInsert?.(p, node.depth);
      if (node.points.length > CAPACITY && node.depth < MAX_DEPTH) {
        this.split(node);
      }
      return;
    }
    // 已分裂：路由到对应象限
    const idx = this.childIndex(node, p);
    this.insertRec(node.children[idx], p);
  }

  private split(node: QuadNode): void {
    const { x0, y0, x1, y1 } = node.region;
    const mx = Math.floor((x0 + x1) / 2);
    const my = Math.floor((y0 + y1) / 2);
    const d = node.depth + 1;
    // NW (x0..mx, my+1..y1), NE (mx+1..x1, my+1..y1), SW (x0..mx, y0..my), SE (mx+1..x1, y0..my)
    node.children = [
      { region: { x0, y0: my + 1, x1: mx, y1: y1 }, depth: d, points: [], children: null },
      { region: { x0: mx + 1, y0: my + 1, x1, y1: y1 }, depth: d, points: [], children: null },
      { region: { x0, y0, x1: mx, y1: my }, depth: d, points: [], children: null },
      { region: { x0: mx + 1, y0, x1, y1: my }, depth: d, points: [], children: null },
    ];
    this.hooks.onSplit?.(node.region, d);
    // 把已有点重新路由
    const oldPoints = node.points;
    node.points = [];
    for (const p of oldPoints) {
      const idx = this.childIndex(node, p);
      node.children[idx].points.push(p);
    }
  }

  private childIndex(node: QuadNode, p: QPoint): 0 | 1 | 2 | 3 {
    const { x0, y0, x1, y1 } = node.region;
    const mx = Math.floor((x0 + x1) / 2);
    const my = Math.floor((y0 + y1) / 2);
    const east = p.x > mx;
    const north = p.y > my;
    // NW=0, NE=1, SW=2, SE=3
    if (north && !east) return 0;
    if (north && east) return 1;
    if (!north && !east) return 2;
    return 3;
  }

  /** 查询矩形内所有点。 */
  rangeQuery(rect: Rect): QPoint[] {
    const out: QPoint[] = [];
    this.queryRec(this.root, rect, out);
    return out;
  }

  private queryRec(node: QuadNode, rect: Rect, out: QPoint[]): void {
    this.hooks.onVisit?.(node.region, node.depth);
    if (!this.intersect(node.region, rect)) return;
    if (node.children === null || this.contains(rect, node.region)) {
      // 整棵子树纳入
      if (node.children !== null) this.hooks.onFullyContained?.(node.region, node.points.length);
      // 叶子节点需要逐点过滤（因为叶子区域可能部分相交）
      if (node.children === null) {
        for (const p of node.points) {
          if (this.inRect(p, rect)) {
            out.push(p);
            this.hooks.onCollect?.(p);
          }
        }
      } else {
        // 完全包含：所有点都纳入（需逐点确认在子树里）
        this.collectAll(node, rect, out);
      }
      return;
    }
    for (const c of node.children) this.queryRec(c, rect, out);
  }

  private collectAll(node: QuadNode, rect: Rect, out: QPoint[]): void {
    for (const p of node.points) {
      if (this.inRect(p, rect)) {
        out.push(p);
        this.hooks.onCollect?.(p);
      }
    }
    if (node.children !== null) {
      for (const c of node.children) this.collectAll(c, rect, out);
    }
  }

  private intersect(a: Rect, b: Rect): boolean {
    return !(a.x1 < b.x0 || b.x1 < a.x0 || a.y1 < b.y0 || b.y1 < a.y0);
  }

  private contains(outer: Rect, inner: Rect): boolean {
    return (
      outer.x0 <= inner.x0 && outer.y0 <= inner.y0 && outer.x1 >= inner.x1 && outer.y1 >= inner.y1
    );
  }

  private inRect(p: QPoint, r: Rect): boolean {
    return p.x >= r.x0 && p.x <= r.x1 && p.y >= r.y0 && p.y <= r.y1;
  }
}
