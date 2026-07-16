// =============================================================================
// 动态凸包（增量）· 录制帧序列
// 用 setGraph 展示点集与当前凸包边，每次插入点后更新一帧。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DynamicConvexHull, type Point, type DynamicHullHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 依次插入的点
  points: [
    { x: 1, y: 1 },
    { x: 5, y: 2 },
    { x: 9, y: 4 },
    { x: 3, y: 7 },
    { x: 7, y: 8 },
    { x: 2, y: 4 },
    { x: 6, y: 5 },
    { x: 8, y: 6 },
  ] as Point[],
};

interface BuildTraceInput {
  points?: Point[];
}

const BX = 10;
const BY = 10;

const norm = (x: number, y: number) => ({
  x: x / BX,
  y: 1 - y / BY,
});

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const points = input.points ?? DEFAULT_INPUT.points;
  const rec = new TraceRecorder();

  // 已插入点的节点列表
  const inserted: Point[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const hull = hullArr;
    const hullIdSet = new Set(hull.map((p) => `${p.x},${p.y}`));
    const nodes: GraphNode[] = inserted.map((p, i) => {
      const np = norm(p.x, p.y);
      const onHull = hullIdSet.has(`${p.x},${p.y}`);
      return {
        id: `p${i}`,
        label: String(i),
        x: np.x,
        y: np.y,
        role: (onHull ? 'final' : 'default') as BarRole,
      };
    });
    // 凸包边：把 hull 中相邻点连起来（需先映射回 id）
    const idOf = (p: Point): string | null => {
      for (let i = 0; i < inserted.length; i++) {
        if (inserted[i]!.x === p.x && inserted[i]!.y === p.y) return `p${i}`;
      }
      return null;
    };
    const edges: GraphEdge[] = [];
    for (let i = 0; i < hull.length; i++) {
      const a = idOf(hull[i]!);
      const b = idOf(hull[(i + 1) % hull.length]!);
      if (a && b) edges.push({ from: a, to: b, role: 'swap' as BarRole });
    }
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '已插入', value: String(inserted.length), role: 'pivot' as BarRole },
        { label: '凸包顶点', value: String(hull.length), role: 'final' as BarRole },
      ])
      .commit();
  };

  // 凸包缓存
  let hullArr: Point[] = [];

  const hooks: DynamicHullHooks = {
    onAddPoint: (p) => {
      inserted.push(p);
      render({
        zh: `插入点 (${p.x},${p.y})`,
        en: `Insert point (${p.x},${p.y})`,
      });
    },
    onInside: (_p) => {
      // 已通过 onAfterInsert 渲染
    },
    onAfterInsert: (hull) => {
      hullArr = [...hull];
      render({
        zh: `更新后凸包（${hull.length} 个顶点）`,
        en: `Updated hull (${hull.length} vertices)`,
      });
    },
  };

  const dch = new DynamicConvexHull(hooks);
  for (const p of points) {
    dch.add(p);
  }

  // 终态
  hullArr = dch.getHull();
  render({
    zh: `完成：共 ${points.length} 点，凸包 ${hullArr.length} 顶点`,
    en: `Done: ${points.length} points, hull has ${hullArr.length} vertices`,
  });

  return rec.build();
}
