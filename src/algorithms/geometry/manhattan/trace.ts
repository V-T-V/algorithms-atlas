// 曼哈顿距离 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { manhattan, type Point, type ManhattanHooks } from './impl.ts';

export interface MhInput {
  a: Point;
  b: Point;
}

export const DEFAULT_INPUT: MhInput = {
  a: { x: 1, y: 1 },
  b: { x: 4, y: 5 },
};

/** 录制演示帧序列。 */
export function buildTrace(input: MhInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;

  rec
    .begin({ zh: `两点 A(${a.x},${a.y}) 与 B(${b.x},${b.y})`, en: `Points A and B` })
    .setAux([
      { label: 'A', value: `(${a.x},${a.y})`, role: 'pivot' as BarRole },
      { label: 'B', value: `(${b.x},${b.y})`, role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: ManhattanHooks = {
    onAxis: (axis, delta) => {
      rec
        .begin({ zh: `${axis} 轴分量 |Δ| = ${delta}`, en: `${axis} axis |delta| = ${delta}` })
        .setBars([{ value: delta, role: 'compare' as BarRole }])
        .commit();
    },
  };
  const { distance } = manhattan(a, b, hooks);

  rec
    .begin({ zh: `完成：距离 = ${distance}`, en: `Done: distance = ${distance}` })
    .setBars([{ value: distance, role: 'final' as BarRole }])
    .setMap([{ key: '曼哈顿距离', value: String(distance), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
