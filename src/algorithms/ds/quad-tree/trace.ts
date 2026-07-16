// =============================================================================
// 四叉树 · 录制帧序列
// 用 setGraph 展示 2D 点集（归一化坐标），用 setTree 展示四叉树划分结构。
// 插入的点标 'compare'，分裂节点标 'swap'，查询命中点标 'final'。
// =============================================================================

import type { BarRole, Frame, GraphNode, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { QuadTree, type Point, type QuadTreeHooks, type Rect } from './impl.ts';

export const DEFAULT_INPUT = {
  bounds: { x1: 0, y1: 0, x2: 16, y2: 16 } as Rect,
  capacity: 2,
  points: [
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 12, y: 4 },
    { x: 5, y: 13 },
    { x: 13, y: 14 },
    { x: 14, y: 13 },
    { x: 8, y: 8 },
    { x: 1, y: 14 },
    { x: 15, y: 2 },
  ] as Point[],
  queries: [{ x1: 10, y1: 10, x2: 16, y2: 16 } as Rect],
};

interface VizNode {
  bounds: Rect;
  depth: number;
  points: Point[];
  children: VizNode[];
  id: string;
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    bounds: Rect;
    capacity?: number;
    points: readonly Point[];
    queries?: readonly Rect[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const pts = input.points;
  const norm = (p: Point): { x: number; y: number } => {
    const b = input.bounds;
    const sx = b.x2 - b.x1 || 1;
    const sy = b.y2 - b.y1 || 1;
    const pad = 0.08;
    return {
      x: pad + (1 - 2 * pad) * ((p.x - b.x1) / sx),
      y: pad + (1 - 2 * pad) * (1 - (p.y - b.y1) / sy),
    };
  };

  // 维护一份「可视化的树根」（手动重建，因内部节点不可见）
  const vizRoot: VizNode = { bounds: input.bounds, depth: 0, points: [], children: [], id: 'r' };
  let counter = 1;
  /** 按边界找到 viz 节点（叶子）。 */
  const findLeaf = (bounds: Rect, depth: number): VizNode => {
    const walk = (n: VizNode): VizNode => {
      if (n.children.length === 0 && n.depth === depth) {
        // 边界匹配检查
        if (
          n.bounds.x1 === bounds.x1 &&
          n.bounds.y1 === bounds.y1 &&
          n.bounds.x2 === bounds.x2 &&
          n.bounds.y2 === bounds.y2
        )
          return n;
      }
      for (const c of n.children) {
        const r = walk(c);
        if (r) return r;
      }
      return n;
    };
    return walk(vizRoot);
  };

  let hotPoint: number | null = null; // 插入的点 id（用数组下标）
  let splitBounds: Rect | null = null;
  let hitPoints = new Set<number>();
  let queryRect: Rect | null = null;

  /** viz 树 -> TreeNode。 */
  const toTreeNode = (vn: VizNode): TreeNode => {
    let role: BarRole | undefined;
    if (splitBounds && vn.bounds.x1 === splitBounds.x1 && vn.bounds.y2 === splitBounds.y2)
      role = 'swap';
    return {
      id: vn.id,
      value: `d${vn.depth}:${vn.points.length}`,
      children: vn.children.length ? vn.children.map(toTreeNode) : undefined,
      role,
    };
  };

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = pts.map((p, i) => {
      const np = norm(p);
      let role: BarRole = 'default';
      if (hitPoints.has(i)) role = 'final';
      else if (i === hotPoint) role = 'compare';
      return { id: `p${i}`, label: `${i}`, x: np.x, y: np.y, role };
    });
    // 查询框用 4 个 frontier 节点勾勒
    if (queryRect) {
      const corners = [
        { x: queryRect.x1, y: queryRect.y1 },
        { x: queryRect.x2, y: queryRect.y1 },
        { x: queryRect.x2, y: queryRect.y2 },
        { x: queryRect.x1, y: queryRect.y2 },
      ];
      for (let k = 0; k < 4; k++) {
        const np = norm(corners[k]!);
        nodes.push({ id: `q${k}`, x: np.x, y: np.y, role: 'frontier' });
      }
    }
    rec.begin(note).setGraph(nodes, []).setTree(toTreeNode(vizRoot)).commit();
  };

  render({
    zh: `点集 ${pts.length} 个，边界 ${input.bounds.x2}×${input.bounds.y2}`,
    en: `${pts.length} points, bounds ${input.bounds.x2}x${input.bounds.y2}`,
  });

  const qt = new QuadTree(input.bounds, input.capacity ?? 4);

  const insertHooks: QuadTreeHooks = {
    onInsert: (p, bounds, depth) => {
      const leaf = findLeaf(bounds, depth);
      leaf.points.push(p);
      // 用数组下标作为 hot id
      hotPoint = pts.findIndex((q) => q.x === p.x && q.y === p.y);
    },
    onSplit: (bounds, depth) => {
      const leaf = findLeaf(bounds, depth);
      splitBounds = bounds;
      const { x1, y1, x2, y2 } = bounds;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const quads: VizNode[] = [
        {
          bounds: { x1, y1: my, x2: mx, y2 },
          depth: depth + 1,
          points: [],
          children: [],
          id: `n${counter++}`,
        },
        {
          bounds: { x1: mx, y1: my, x2, y2 },
          depth: depth + 1,
          points: [],
          children: [],
          id: `n${counter++}`,
        },
        {
          bounds: { x1, y1, x2: mx, y2: my },
          depth: depth + 1,
          points: [],
          children: [],
          id: `n${counter++}`,
        },
        {
          bounds: { x1: mx, y1, x2, y2: my },
          depth: depth + 1,
          points: [],
          children: [],
          id: `n${counter++}`,
        },
      ];
      // 下放点
      for (const p of leaf.points) {
        for (const q of quads) {
          if (
            p.x >= q.bounds.x1 &&
            p.x <= q.bounds.x2 &&
            p.y >= q.bounds.y1 &&
            p.y <= q.bounds.y2
          ) {
            q.points.push(p);
            break;
          }
        }
      }
      leaf.points = [];
      leaf.children = quads;
      render({ zh: `节点超容量，分裂为 4 象限`, en: `Node over capacity, split into 4 quadrants` });
    },
  };

  for (let i = 0; i < pts.length; i++) {
    hotPoint = i;
    splitBounds = null;
    qt.insert(pts[i]!, insertHooks);
    render({
      zh: `插入点 ${i} (${pts[i]!.x},${pts[i]!.y})`,
      en: `Insert point ${i} (${pts[i]!.x},${pts[i]!.y})`,
    });
  }

  // 查询阶段
  for (const q of input.queries ?? []) {
    hitPoints = new Set<number>();
    queryRect = q;
    render({
      zh: `区域查询 [${q.x1},${q.y1}]-[${q.x2},${q.y2}]`,
      en: `Range query [${q.x1},${q.y1}]-[${q.x2},${q.y2}]`,
    });
    const result = qt.queryRange(q, {
      onQueryHit: (p) => {
        const idx = pts.findIndex((r) => r.x === p.x && r.y === p.y);
        if (idx >= 0) hitPoints.add(idx);
      },
    });
    render({ zh: `命中 ${result.length} 个点`, en: `${result.length} points hit` });
  }

  // 终态
  hotPoint = null;
  splitBounds = null;
  queryRect = null;
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setGraph(
      pts.map((p, i) => ({ id: `p${i}`, label: `${i}`, ...norm(p), role: 'final' as BarRole })),
      [],
    )
    .setTree(toTreeNode(vizRoot))
    .commit();

  return rec.build();
}
