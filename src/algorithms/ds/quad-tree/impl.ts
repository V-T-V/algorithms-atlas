// =============================================================================
// 四叉树 Quad Tree · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：2D 点四叉树。把平面 AABB 递归四等分（NE/NW/SE/SW），
//   - 每个节点最多存 capacity 个点；超过则分裂成 4 子象限
//   - 区域查询 [qx1,qy1]-[qx2,qy2]：相交则递归，返回框内所有点
// =============================================================================

/** 二维点。 */
export interface Point {
  x: number;
  y: number;
  id?: number;
}

/** 轴对齐矩形（这里用 [x1,y1]-[x2,y2]，x1<=x2, y1<=y2）。 */
export interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface QuadTreeHooks {
  /** 插入：访问某节点边界（mx,my 为中心），depth 为深度。 */
  onVisitNode?: (bounds: Rect, depth: number) => void;
  /** 插入：点落入某节点并被存下。 */
  onInsert?: (p: Point, bounds: Rect, depth: number) => void;
  /** 节点因超容量而分裂为 4 个子象限。 */
  onSplit?: (bounds: Rect, depth: number) => void;
  /** 区域查询：访问节点边界，contained 表示完全包含于查询框。 */
  onQueryVisit?: (bounds: Rect, contained: boolean) => void;
  /** 区域查询：命中一个点。 */
  onQueryHit?: (p: Point) => void;
  /** 区域查询：剪枝（不相交）。 */
  onQueryPrune?: (bounds: Rect) => void;
}

/** 四叉树节点。 */
class QTNode {
  bounds: Rect;
  points: Point[] = [];
  children: [QTNode, QTNode, QTNode, QTNode] | null = null; // NW,NE,SW,SE
  constructor(bounds: Rect) {
    this.bounds = bounds;
  }
}

/** 两矩形是否相交。 */
function intersects(a: Rect, b: Rect): boolean {
  return a.x1 <= b.x2 && a.x2 >= b.x1 && a.y1 <= b.y2 && a.y2 >= b.y1;
}

/** a 是否完全包含 b。 */
function contains(a: Rect, b: Rect): boolean {
  return a.x1 <= b.x1 && a.x2 >= b.x2 && a.y1 <= b.y1 && a.y2 >= b.y2;
}

/** 点是否在矩形内。 */
function pointInRect(p: Point, r: Rect): boolean {
  return p.x >= r.x1 && p.x <= r.x2 && p.y >= r.y1 && p.y <= r.y2;
}

/**
 * 点四叉树。
 */
export class QuadTree {
  readonly root: QTNode;
  readonly capacity: number;
  readonly maxDepth: number;

  constructor(bounds: Rect, capacity = 4, maxDepth = 6) {
    this.root = new QTNode(bounds);
    this.capacity = capacity;
    this.maxDepth = maxDepth;
  }

  /** 插入一个点。 */
  insert(p: Point, hooks: QuadTreeHooks = {}, depth = 0, node: QTNode = this.root): boolean {
    if (!pointInRect(p, node.bounds)) return false;
    hooks.onVisitNode?.(node.bounds, depth);
    if (node.children) {
      // 已分裂：分派到子象限
      for (const c of node.children) if (this.insert(p, hooks, depth + 1, c)) return true;
      return false;
    }
    // 叶子：存点
    node.points.push(p);
    hooks.onInsert?.(p, node.bounds, depth);
    // 超容量且未达最大深度：分裂
    if (node.points.length > this.capacity && depth < this.maxDepth) {
      this.split(node, depth, hooks);
    }
    return true;
  }

  /** 分裂节点。 */
  private split(node: QTNode, depth: number, hooks: QuadTreeHooks): void {
    const { x1, y1, x2, y2 } = node.bounds;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    node.children = [
      new QTNode({ x1, y1: my, x2: mx, y2 }), // NW（左上）
      new QTNode({ x1: mx, y1: my, x2, y2 }), // NE（右上）
      new QTNode({ x1, y1, x2: mx, y2: my }), // SW（左下）
      new QTNode({ x1: mx, y1, x2, y2: my }), // SE（右下）
    ];
    hooks.onSplit?.(node.bounds, depth);
    // 把已存点下放到子象限
    const old = node.points;
    node.points = [];
    for (const p of old) {
      for (const c of node.children) {
        if (pointInRect(p, c.bounds)) {
          c.points.push(p);
          break;
        }
      }
    }
  }

  /** 区域查询：返回查询框内的所有点。 */
  queryRange(query: Rect, hooks: QuadTreeHooks = {}, node: QTNode = this.root): Point[] {
    if (!intersects(node.bounds, query)) {
      hooks.onQueryPrune?.(node.bounds);
      return [];
    }
    const fully = contains(query, node.bounds);
    hooks.onQueryVisit?.(node.bounds, fully);
    if (node.children) {
      const out: Point[] = [];
      for (const c of node.children) out.push(...this.queryRange(query, hooks, c));
      return out;
    }
    // 叶子：若被查询框完全包含，全部收；否则逐点过滤
    const result: Point[] = [];
    for (const p of node.points) {
      if (pointInRect(p, query)) {
        result.push(p);
        hooks.onQueryHit?.(p);
      }
    }
    return result;
  }
}

/**
 * 便利函数：批量插入并执行区域查询，返回命中点列表。
 */
export function quadTree(
  input: {
    bounds: Rect;
    capacity?: number;
    points: Point[];
    queries?: Rect[];
  },
  hooks: QuadTreeHooks = {},
): Point[][] {
  const qt = new QuadTree(input.bounds, input.capacity ?? 4);
  for (const p of input.points) qt.insert(p, hooks);
  return (input.queries ?? []).map((q) => qt.queryRange(q, hooks));
}
