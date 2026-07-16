// Voronoi图 · 录制帧序列（Delaunay 的对偶）

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { voronoi, type Point, type VoronoiHooks } from './impl.ts';

export interface VoInput {
  points: Point[];
}

export const DEFAULT_INPUT: VoInput = {
  points: [
    { x: 2, y: 2 },
    { x: 7, y: 2 },
    { x: 4, y: 6 },
    { x: 8, y: 7 },
    { x: 1, y: 8 },
  ],
};

const px = (v: number): number => (v % 10) / 10;
const py = (v: number): number => 1 - (v % 10) / 10;

/** 录制演示帧序列。 */
export function buildTrace(input: VoInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points } = input;

  rec
    .begin({ zh: `站点集（${points.length} 个）`, en: `Sites (${points.length})` })
    .setGraph(
      points.map((p, i) => ({
        id: `s${i}`,
        label: String(i),
        x: px(p.x),
        y: py(p.y),
        role: 'pivot' as BarRole,
      })),
      [],
    )
    .commit();

  const hooks: VoronoiHooks = {
    onDualEdge: (_e) => {},
  };
  const { edges } = voronoi(points, hooks);

  const finiteEdges = edges.filter((e) => e.from && e.to);
  const voronoiNodes = [
    ...points.map((p, i) => ({
      id: `s${i}`,
      label: String(i),
      x: px(p.x),
      y: py(p.y),
      role: 'pivot' as BarRole,
    })),
  ];
  finiteEdges.forEach((e, k) => {
    if (e.from)
      voronoiNodes.push({
        id: `v${k}a`,
        label: '',
        x: px(e.from.x),
        y: py(e.from.y),
        role: 'final' as BarRole,
      });
    if (e.to)
      voronoiNodes.push({
        id: `v${k}b`,
        label: '',
        x: px(e.to.x),
        y: py(e.to.y),
        role: 'final' as BarRole,
      });
  });
  const vorEdges = finiteEdges.map((_, k) => ({ from: `v${k}a`, to: `v${k}b` }));

  rec
    .begin({
      zh: `完成：${finiteEdges.length} 条有限 Voronoi 边`,
      en: `Done: ${finiteEdges.length} finite Voronoi edges`,
    })
    .setGraph(voronoiNodes, vorEdges)
    .setMap([{ key: 'Voronoi 边数', value: String(edges.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
