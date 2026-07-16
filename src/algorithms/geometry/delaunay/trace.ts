// Delaunay三角剖分 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { delaunay, type Point, type DelaunayHooks } from './impl.ts';

export interface DtInput {
  points: Point[];
}

export const DEFAULT_INPUT: DtInput = {
  points: [
    { x: 1, y: 1 },
    { x: 6, y: 1 },
    { x: 4, y: 5 },
    { x: 8, y: 6 },
    { x: 2, y: 7 },
  ],
};

const px = (v: number): number => (v % 10) / 10;
const py = (v: number): number => 1 - (v % 10) / 10;

/** 录制演示帧序列。 */
export function buildTrace(input: DtInput = DEFAULT_INPUT): Frame[] {
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

  const hooks: DelaunayHooks = {
    onCheck: (_tri, ok) => {
      void ok;
    },
  };
  const { triangles } = delaunay(points, hooks);

  const edges = triangles.flatMap((t) => [
    { from: `p${t.i}`, to: `p${t.j}` },
    { from: `p${t.j}`, to: `p${t.k}` },
    { from: `p${t.i}`, to: `p${t.k}` },
  ]);

  rec
    .begin({
      zh: `完成：${triangles.length} 个 Delaunay 三角形`,
      en: `Done: ${triangles.length} Delaunay triangles`,
    })
    .setGraph(
      points.map((p, i) => ({
        id: `p${i}`,
        label: String(i),
        x: px(p.x),
        y: py(p.y),
        role: 'final' as BarRole,
      })),
      edges,
    )
    .setMap([{ key: '三角形数', value: String(triangles.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
