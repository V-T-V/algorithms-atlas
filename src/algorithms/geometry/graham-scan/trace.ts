// Graham扫描 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grahamScan, type Point, type GrahamScanHooks } from './impl.ts';

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
const idOf = (points: Point[], p: Point): string =>
  `p${points.findIndex((q) => q.x === p.x && q.y === p.y)}`;

/** 录制演示帧序列。 */
export function buildTrace(input: HullInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points } = input;

  rec
    .begin({ zh: `点集（${points.length} 个）`, en: `Point set (${points.length} pts)` })
    .setGraph(
      points.map((p, i) => ({
        id: `p${i}`,
        label: String(i),
        x: px(p.x),
        y: py(p.y),
        role: 'default' as BarRole,
      })),
      [],
    )
    .commit();

  const hooks: GrahamScanHooks = {
    onAnchor: (a) => {
      rec
        .begin({ zh: `选定极点（最下/最左）`, en: `Pick anchor (lowest-leftmost)` })
        .setGraph(
          points.map((q, i) => ({
            id: `p${i}`,
            label: String(i),
            x: px(q.x),
            y: py(q.y),
            role: (q.x === a.x && q.y === a.y ? 'pivot' : 'default') as BarRole,
          })),
          [],
        )
        .commit();
    },
    onSorted: () => {
      rec.begin({ zh: `按极角排序`, en: `Sort by polar angle` }).commit();
    },
    onPush: () => {},
    onPop: () => {},
  };
  const { hull } = grahamScan(points, hooks);

  const hullSet = new Set(hull.map((p) => idOf(points, p)));
  const hullEdges = hull.map((_, i) => ({
    from: idOf(points, hull[i]!),
    to: idOf(points, hull[(i + 1) % hull.length]!),
  }));

  rec
    .begin({ zh: `完成：凸包 ${hull.length} 个顶点`, en: `Done: hull has ${hull.length} vertices` })
    .setGraph(
      points.map((q, i) => ({
        id: `p${i}`,
        label: String(i),
        x: px(q.x),
        y: py(q.y),
        role: (hullSet.has(`p${i}`) ? 'final' : 'default') as BarRole,
      })),
      hullEdges,
    )
    .setMap([{ key: '凸包顶点数', value: String(hull.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
