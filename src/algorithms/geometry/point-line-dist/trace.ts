// 点到直线距离 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pointLineDist, type Point, type PointLineDistHooks } from './impl.ts';

export interface PldInput {
  a: Point;
  b: Point;
  p: Point;
}

export const DEFAULT_INPUT: PldInput = {
  a: { x: 0, y: 0 },
  b: { x: 6, y: 0 },
  p: { x: 3, y: 4 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: PldInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b, p } = input;

  rec
    .begin({ zh: `直线 AB 与点 P`, en: `Line AB and point P` })
    .setAux([
      { label: 'A', value: `(${a.x},${a.y})`, role: 'final' as BarRole },
      { label: 'B', value: `(${b.x},${b.y})`, role: 'final' as BarRole },
      { label: 'P', value: `(${p.x},${p.y})`, role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: PointLineDistHooks = {
    onResult: (d) => {
      void d;
    },
  };
  const { distance } = pointLineDist({ a, b }, p, hooks);

  rec
    .begin({
      zh: `完成：距离 = ${distance.toFixed(3)}`,
      en: `Done: distance = ${distance.toFixed(3)}`,
    })
    .setBars([{ value: Number(distance.toFixed(3)), role: 'final' as BarRole }])
    .setMap([{ key: '距离', value: distance.toFixed(3), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
