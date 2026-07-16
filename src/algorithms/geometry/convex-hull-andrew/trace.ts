// Andrew凸包 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { convexHullAndrew, type Point, type ConvexHullAndrewHooks } from './impl.ts';

export interface HullInput {
  points: Point[];
}

export const DEFAULT_INPUT: HullInput = {
  points: [
    { x: 1, y: 1 },
    { x: 3, y: 5 },
    { x: 5, y: 2 },
    { x: 7, y: 6 },
    { x: 2, y: 7 },
    { x: 8, y: 3 },
    { x: 4, y: 4 },
    { x: 6, y: 8 },
  ],
};

const px = (v: number): number => (v % 10) / 10;
const py = (v: number): number => 1 - (v % 10) / 10;

/** 录制演示帧序列。 */
export function buildTrace(input: HullInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points } = input;
  const hullIds = new Set<string>();

  const baseGraph = () => ({
    nodes: points.map((p, i) => ({
      id: `p${i}`,
      label: String(i),
      x: px(p.x),
      y: py(p.y),
      role: (hullIds.has(`p${i}`) ? 'final' : 'default') as BarRole,
    })),
    edges: [] as Array<{ from: string; to: string }>,
  });

  rec
    .begin({ zh: `点集（${points.length} 个）`, en: `Point set (${points.length} pts)` })
    .setGraph(baseGraph().nodes, [])
    .commit();

  const hooks: ConvexHullAndrewHooks = {
    onPush: (_p) => {},
    onPop: (_p) => {},
    onSort: () => {
      rec
        .begin({ zh: `按 x（然后 y）排序`, en: `Sort by x then y` })
        .setGraph(baseGraph().nodes, [])
        .commit();
    },
  };
  const { hull } = convexHullAndrew(points, hooks);

  // 把凸包点标记出来
  for (const p of hull) {
    const idx = points.findIndex((q) => q.x === p.x && q.y === p.y);
    if (idx >= 0) hullIds.add(`p${idx}`);
  }
  const hullEdges = hull.map((_, i) => ({
    from: `p${points.findIndex((q) => q.x === hull[i]!.x && q.y === hull[i]!.y)}`,
    to: `p${points.findIndex((q) => q.x === hull[(i + 1) % hull.length]!.x && q.y === hull[(i + 1) % hull.length]!.y)}`,
  }));

  rec
    .begin({ zh: `完成：凸包 ${hull.length} 个顶点`, en: `Done: hull has ${hull.length} vertices` })
    .setGraph(baseGraph().nodes, hullEdges)
    .setMap([{ key: '凸包顶点数', value: String(hull.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
