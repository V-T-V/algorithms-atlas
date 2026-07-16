// 三角形面积 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { triangleArea, type Point, type TriangleAreaHooks } from './impl.ts';

export interface TriInput {
  pts: [Point, Point, Point];
}

export const DEFAULT_INPUT: TriInput = {
  pts: [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 3, y: 4 },
  ],
};

const graphFrom = (pts: Point[], roles: Record<string, BarRole> = {}) => ({
  nodes: pts.map((p, i) => ({
    id: String(i),
    label: `(${p.x},${p.y})`,
    x: (p.x % 10) / 10,
    y: 1 - (p.y % 10) / 10,
    role: roles[i] ?? ('default' as BarRole),
  })),
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
  ],
});

/** 录制演示帧序列。 */
export function buildTrace(input: TriInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { pts } = input;

  rec
    .begin({ zh: `三角形三顶点`, en: `Triangle vertices` })
    .setGraph(graphFrom(pts).nodes, graphFrom(pts).edges)
    .commit();

  let result = 0;
  const hooks: TriangleAreaHooks = {
    onResult: (a) => {
      result = a;
    },
  };
  const { area } = triangleArea(pts, hooks);

  rec
    .begin({ zh: `面积 = |叉积| / 2 = ${area}`, en: `Area = |cross| / 2 = ${area}` })
    .setGraph(
      graphFrom(pts, { '0': 'final', '1': 'final', '2': 'final' }).nodes,
      graphFrom(pts).edges,
    )
    .setMap([{ key: '面积', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
