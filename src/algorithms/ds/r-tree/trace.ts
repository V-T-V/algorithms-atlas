// =============================================================================
// R树 · 录制帧序列
// 用 setGraph 展示点集 + MBR 边界（用 frontier 节点勾勒矩形四角）。
// 插入的点标 'compare'，分裂标 'swap'，查询命中点标 'final'，查询框标 'pivot'。
// =============================================================================

import type { BarRole, Frame, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { RTree, type MBR, type RPoint, type RTreeHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  bounds: { x1: 0, y1: 0, x2: 20, y2: 20 } as MBR,
  capacity: 3,
  points: [
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 2 },
    { x: 15, y: 3 },
    { x: 16, y: 4 },
    { x: 3, y: 16 },
    { x: 14, y: 15 },
    { x: 17, y: 16 },
    { x: 10, y: 10 },
  ] as RPoint[],
  queries: [{ x1: 13, y1: 13, x2: 20, y2: 20 } as MBR],
};

interface VizNode {
  mbr: MBR;
  leaf: boolean;
  points: RPoint[];
  children: VizNode[];
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    bounds: MBR;
    capacity?: number;
    points: readonly RPoint[];
    queries?: readonly MBR[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const pts = input.points;
  const norm = (x: number, y: number): { x: number; y: number } => {
    const b = input.bounds;
    const sx = b.x2 - b.x1 || 1;
    const sy = b.y2 - b.y1 || 1;
    const pad = 0.08;
    return {
      x: pad + (1 - 2 * pad) * ((x - b.x1) / sx),
      y: pad + (1 - 2 * pad) * (1 - (y - b.y1) / sy),
    };
  };

  const vizRoot: VizNode = { mbr: input.bounds, leaf: true, points: [], children: [] };

  let hotPoint = -1;
  let splitFlag = false;
  let hitPoints = new Set<number>();
  let queryRect: MBR | null = null;

  /** 渲染：点 + MBR 四角（frontier）+ 查询框（pivot）。 */
  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = pts.map((p, i) => {
      const np = norm(p.x, p.y);
      let role: BarRole = 'default';
      if (hitPoints.has(i)) role = 'final';
      else if (i === hotPoint) role = 'compare';
      return { id: `p${i}`, label: `${i}`, x: np.x, y: np.y, role };
    });
    // 收集所有 viz 节点的 MBR，画四角
    const stack: VizNode[] = [vizRoot];
    let mbrIdx = 0;
    while (stack.length) {
      const vn = stack.pop()!;
      const corners = [
        { x: vn.mbr.x1, y: vn.mbr.y1 },
        { x: vn.mbr.x2, y: vn.mbr.y1 },
        { x: vn.mbr.x2, y: vn.mbr.y2 },
        { x: vn.mbr.x1, y: vn.mbr.y2 },
      ];
      const role: BarRole = splitFlag && vn === vizRoot ? 'swap' : 'frontier';
      for (const c of corners) {
        const np = norm(c.x, c.y);
        nodes.push({ id: `m${mbrIdx}_${corners.indexOf(c)}`, x: np.x, y: np.y, role });
      }
      mbrIdx++;
      for (const c of vn.children) stack.push(c);
    }
    // 查询框
    if (queryRect) {
      const corners = [
        { x: queryRect.x1, y: queryRect.y1 },
        { x: queryRect.x2, y: queryRect.y1 },
        { x: queryRect.x2, y: queryRect.y2 },
        { x: queryRect.x1, y: queryRect.y2 },
      ];
      for (let k = 0; k < 4; k++) {
        const np = norm(corners[k]!.x, corners[k]!.y);
        nodes.push({ id: `q${k}`, x: np.x, y: np.y, role: 'pivot' });
      }
    }
    rec.begin(note).setGraph(nodes, []).commit();
  };

  render({
    zh: `点集 ${pts.length} 个，根 MBR ${input.bounds.x2}×${input.bounds.y2}`,
    en: `${pts.length} points, root MBR ${input.bounds.x2}x${input.bounds.y2}`,
  });

  const tree = new RTree(input.bounds, input.capacity ?? 4);

  // 同步维护 viz 树：插入点时把点加到对应叶子，分裂时改结构
  const findLeafForPoint = (p: RPoint): VizNode => {
    const walk = (n: VizNode): VizNode => {
      if (n.leaf) return n;
      // 选扩张最小的子节点
      let best = n.children[0]!;
      let bestEnl = Infinity;
      for (const c of n.children) {
        const before = (c.mbr.x2 - c.mbr.x1) * (c.mbr.y2 - c.mbr.y1);
        const after =
          (Math.max(c.mbr.x2, p.x) - Math.min(c.mbr.x1, p.x)) *
          (Math.max(c.mbr.y2, p.y) - Math.min(c.mbr.y1, p.y));
        const enl = after - before;
        if (enl < bestEnl) {
          bestEnl = enl;
          best = c;
        }
      }
      return walk(best);
    };
    return walk(vizRoot);
  };

  const updateMBRUp = (): void => {
    const recompute = (n: VizNode): MBR => {
      if (n.leaf) {
        let m = { ...n.mbr };
        for (const p of n.points)
          m = {
            x1: Math.min(m.x1, p.x),
            y1: Math.min(m.y1, p.y),
            x2: Math.max(m.x2, p.x),
            y2: Math.max(m.y2, p.y),
          };
        n.mbr = m;
        return m;
      }
      let m = n.children[0]!.mbr;
      for (const c of n.children)
        m = {
          x1: Math.min(m.x1, c.mbr.x1),
          y1: Math.min(m.y1, c.mbr.y1),
          x2: Math.max(m.x2, c.mbr.x2),
          y2: Math.max(m.y2, c.mbr.y2),
        };
      n.mbr = m;
      return m;
    };
    recompute(vizRoot);
  };

  const insertHooks: RTreeHooks = {
    onInsert: () => {},
    onSplit: () => {
      splitFlag = true;
    },
  };

  for (let i = 0; i < pts.length; i++) {
    hotPoint = i;
    splitFlag = false;
    tree.insert(pts[i]!, insertHooks);
    // 同步 viz：把点加到叶子
    const leaf = findLeafForPoint(pts[i]!);
    leaf.points.push(pts[i]!);
    updateMBRUp();
    render({
      zh: `插入点 ${i} (${pts[i]!.x},${pts[i]!.y})`,
      en: `Insert point ${i} (${pts[i]!.x},${pts[i]!.y})`,
    });
    // 注意：viz 树不精确模拟内部分裂，仅用 splitFlag 提示
  }

  for (const q of input.queries ?? []) {
    hitPoints = new Set<number>();
    queryRect = q;
    render({
      zh: `区域查询 [${q.x1},${q.y1}]-[${q.x2},${q.y2}]`,
      en: `Range query [${q.x1},${q.y1}]-[${q.x2},${q.y2}]`,
    });
    const result = tree.queryRange(q, {
      onQueryHit: (p) => {
        const idx = pts.findIndex((r) => r.x === p.x && r.y === p.y);
        if (idx >= 0) hitPoints.add(idx);
      },
    });
    render({ zh: `命中 ${result.length} 个点`, en: `${result.length} points hit` });
  }

  hotPoint = -1;
  splitFlag = false;
  queryRect = null;
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setGraph(
      pts.map((p, i) => ({
        id: `p${i}`,
        label: `${i}`,
        ...norm(p.x, p.y),
        role: 'final' as BarRole,
      })),
      [],
    )
    .commit();

  return rec.build();
}
