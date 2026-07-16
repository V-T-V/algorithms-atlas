// 圆相交 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circleIntersect, type Circle, type CircleIntersectHooks } from './impl.ts';

export interface CiInput {
  c1: Circle;
  c2: Circle;
}

export const DEFAULT_INPUT: CiInput = {
  c1: { c: { x: 3, y: 3 }, r: 3 },
  c2: { c: { x: 7, y: 3 }, r: 2 },
};

const px = (v: number): number => (v % 12) / 12;
const py = (v: number): number => 1 - (v % 12) / 12;

/** 录制演示帧序列。 */
export function buildTrace(input: CiInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { c1, c2 } = input;

  rec
    .begin({ zh: `圆1 r=${c1.r} 与 圆2 r=${c2.r}`, en: `Circle1 r=${c1.r} and Circle2 r=${c2.r}` })
    .setGraph(
      [
        { id: 'O1', label: 'O1', x: px(c1.c.x), y: py(c1.c.y), role: 'pivot' as BarRole },
        { id: 'O2', label: 'O2', x: px(c2.c.x), y: py(c2.c.y), role: 'compare' as BarRole },
      ],
      [],
    )
    .commit();

  const hooks: CircleIntersectHooks = {
    onClassify: (state) => {
      rec
        .begin({ zh: `分类：${state}`, en: `Classified: ${state}` })
        .setMap([{ key: '状态', value: state, role: 'swap' as BarRole }])
        .commit();
    },
  };
  const { state, points } = circleIntersect(c1, c2, hooks);

  rec
    .begin({
      zh: `完成：${state}，${points.length} 个交点`,
      en: `Done: ${state}, ${points.length} intersections`,
    })
    .setGraph(
      [
        { id: 'O1', label: 'O1', x: px(c1.c.x), y: py(c1.c.y), role: 'final' as BarRole },
        { id: 'O2', label: 'O2', x: px(c2.c.x), y: py(c2.c.y), role: 'final' as BarRole },
        ...points.map((p, i) => ({
          id: `X${i}`,
          label: 'X',
          x: px(p.x),
          y: py(p.y),
          role: 'swap' as BarRole,
        })),
      ],
      [],
    )
    .commit();

  return rec.build();
}
