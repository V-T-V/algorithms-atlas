// =============================================================================
// 八叉树 Octree · 纯算法实现（零 DOM 依赖，可独立单测）
// 实现：3D 点八叉树。把立方体 AABB 递归八等分，
//   - 每个节点最多存 capacity 个点；超过则分裂成 8 个体素
//   - 区域查询（3D 框）返回框内所有点
// =============================================================================

/** 三维点。 */
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/** 轴对齐 3D 框。 */
export interface Box {
  x1: number;
  y1: number;
  z1: number;
  x2: number;
  y2: number;
  z2: number;
}

/** 操作过程中的事件钩子。任一可选。 */
export interface OctreeHooks {
  /** 插入：访问节点。 */
  onVisitNode?: (bounds: Box, depth: number) => void;
  /** 插入：点被存下。 */
  onInsert?: (p: Point3D, depth: number) => void;
  /** 节点超容量分裂为 8 个体素。 */
  onSplit?: (bounds: Box, depth: number) => void;
  /** 区域查询：访问节点，contained 表示被完全包含。 */
  onQueryVisit?: (bounds: Box, contained: boolean) => void;
  /** 区域查询：命中点。 */
  onQueryHit?: (p: Point3D) => void;
  /** 区域查询：剪枝（不相交）。 */
  onQueryPrune?: (bounds: Box) => void;
}

/** 八叉树节点。 */
class OTNode {
  bounds: Box;
  points: Point3D[] = [];
  children: OTNode[] | null = null;
  constructor(bounds: Box) {
    this.bounds = bounds;
  }
}

function boxIntersect(a: Box, b: Box): boolean {
  return (
    a.x1 <= b.x2 && a.x2 >= b.x1 && a.y1 <= b.y2 && a.y2 >= b.y1 && a.z1 <= b.z2 && a.z2 >= b.z1
  );
}

function boxContains(outer: Box, inner: Box): boolean {
  return (
    outer.x1 <= inner.x1 &&
    outer.x2 >= inner.x2 &&
    outer.y1 <= inner.y1 &&
    outer.y2 >= inner.y2 &&
    outer.z1 <= inner.z1 &&
    outer.z2 >= inner.z2
  );
}

function pointInBox(p: Point3D, b: Box): boolean {
  return p.x >= b.x1 && p.x <= b.x2 && p.y >= b.y1 && p.y <= b.y2 && p.z >= b.z1 && p.z <= b.z2;
}

/**
 * 点八叉树（3D）。
 */
export class Octree {
  readonly root: OTNode;
  readonly capacity: number;
  readonly maxDepth: number;

  constructor(bounds: Box, capacity = 4, maxDepth = 5) {
    this.root = new OTNode(bounds);
    this.capacity = capacity;
    this.maxDepth = maxDepth;
  }

  insert(p: Point3D, hooks: OctreeHooks = {}, depth = 0, node: OTNode = this.root): boolean {
    if (!pointInBox(p, node.bounds)) return false;
    hooks.onVisitNode?.(node.bounds, depth);
    if (node.children) {
      for (const c of node.children) if (this.insert(p, hooks, depth + 1, c)) return true;
      return false;
    }
    node.points.push(p);
    hooks.onInsert?.(p, depth);
    if (node.points.length > this.capacity && depth < this.maxDepth) {
      this.split(node, depth, hooks);
    }
    return true;
  }

  private split(node: OTNode, depth: number, hooks: OctreeHooks): void {
    const { x1, y1, z1, x2, y2, z2 } = node.bounds;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const mz = (z1 + z2) / 2;
    const children: OTNode[] = [];
    // 8 个体素：x(低/高) × y(低/高) × z(低/高)
    for (const [lx, hx] of [
      [x1, mx],
      [mx, x2],
    ]) {
      for (const [ly, hy] of [
        [y1, my],
        [my, y2],
      ]) {
        for (const [lz, hz] of [
          [z1, mz],
          [mz, z2],
        ]) {
          children.push(new OTNode({ x1: lx!, y1: ly!, z1: lz!, x2: hx!, y2: hy!, z2: hz! }));
        }
      }
    }
    node.children = children;
    hooks.onSplit?.(node.bounds, depth);
    const old = node.points;
    node.points = [];
    for (const p of old) {
      for (const c of children) {
        if (pointInBox(p, c.bounds)) {
          c.points.push(p);
          break;
        }
      }
    }
  }

  queryRange(query: Box, hooks: OctreeHooks = {}, node: OTNode = this.root): Point3D[] {
    if (!boxIntersect(node.bounds, query)) {
      hooks.onQueryPrune?.(node.bounds);
      return [];
    }
    const fully = boxContains(query, node.bounds);
    hooks.onQueryVisit?.(node.bounds, fully);
    if (node.children) {
      const out: Point3D[] = [];
      for (const c of node.children) out.push(...this.queryRange(query, hooks, c));
      return out;
    }
    const result: Point3D[] = [];
    for (const p of node.points) {
      if (pointInBox(p, query)) {
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
export function octree(
  input: {
    bounds: Box;
    capacity?: number;
    points: Point3D[];
    queries?: Box[];
  },
  hooks: OctreeHooks = {},
): Point3D[][] {
  const ot = new Octree(input.bounds, input.capacity ?? 4);
  for (const p of input.points) ot.insert(p, hooks);
  return (input.queries ?? []).map((q) => ot.queryRange(q, hooks));
}
