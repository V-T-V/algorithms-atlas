// 最小覆盖圆 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minEnclosingCircle, type Point, type MinEnclosingCircleHooks } from './impl.ts';

export interface MecInput {
  points: Point[];
}

export const DEFAULT_INPUT: MecInput = {
  points: [
    { x: 1, y: 1 },
    { x: 5, y: 1 },
    { x: 3, y: 4 },
    { x: 2, y: 3 },
    { x: 6, y: 2 },
  ],
};

const px = (v: number): number => (v % 10) / 10;
const py = (v: number): number => 1 - (v % 10) / 10;

/** 录制演示帧序列。 */
export function buildTrace(input: MecInput = DEFAULT_INPUT): Frame[] {
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

  const hooks: MinEnclosingCircleHooks = {
    onBoundary: (p) => {
      rec
        .begin({ zh: `点 (${p.x},${p.y}) 在圆边界上`, en: `Point (${p.x},${p.y}) on boundary` })
        .setGraph(
          points.map((q, i) => ({
            id: `p${i}`,
            label: String(i),
            x: px(q.x),
            y: py(q.y),
            role: (q.x === p.x && q.y === p.y ? 'compare' : 'default') as BarRole,
          })),
          [],
        )
        .commit();
    },
  };
  const { circle } = minEnclosingCircle(points, hooks);

  rec
    .begin({
      zh: `完成：圆心 (${circle.c.x.toFixed(2)},${circle.c.y.toFixed(2)}) r=${circle.r.toFixed(2)}`,
      en: `Done: center (${circle.c.x.toFixed(2)},${circle.c.y.toFixed(2)}) r=${circle.r.toFixed(2)}`,
    })
    .setGraph(
      [
        ...points.map((p, i) => ({
          id: `p${i}`,
          label: String(i),
          x: px(p.x),
          y: py(p.y),
          role: 'final' as BarRole,
        })),
        { id: 'C', label: 'C', x: px(circle.c.x), y: py(circle.c.y), role: 'pivot' as BarRole },
      ],
      [],
    )
    .setMap([
      {
        key: '圆心',
        value: `(${circle.c.x.toFixed(2)}, ${circle.c.y.toFixed(2)})`,
        role: 'final' as BarRole,
      },
      { key: '半径', value: circle.r.toFixed(2), role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
