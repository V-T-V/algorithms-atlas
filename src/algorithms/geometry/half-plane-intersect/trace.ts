// 半平面交 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { halfPlaneIntersect, type HalfPlane, type HalfPlaneIntersectHooks } from './impl.ts';

export interface HpiInput {
  hps: HalfPlane[];
}

export const DEFAULT_INPUT: HpiInput = {
  hps: [
    { a: { x: 0, y: 0 }, b: { x: 10, y: 0 } }, // y >= 0
    { a: { x: 10, y: 0 }, b: { x: 10, y: 10 } }, // x <= 10
    { a: { x: 10, y: 10 }, b: { x: 0, y: 10 } }, // y <= 10
    { a: { x: 0, y: 10 }, b: { x: 0, y: 0 } }, // x >= 0
  ],
};

const px = (v: number): number => (v % 12) / 12;
const py = (v: number): number => 1 - (v % 12) / 12;

/** 录制演示帧序列。 */
export function buildTrace(input: HpiInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { hps } = input;

  rec
    .begin({ zh: `${hps.length} 个半平面`, en: `${hps.length} half-planes` })
    .setGraph(
      hps.flatMap((hp, i) => [
        { id: `a${i}`, label: `H${i}`, x: px(hp.a.x), y: py(hp.a.y), role: 'pivot' as BarRole },
        { id: `b${i}`, label: '', x: px(hp.b.x), y: py(hp.b.y), role: 'compare' as BarRole },
      ]),
      hps.map((_, i) => ({ from: `a${i}`, to: `b${i}` })),
    )
    .commit();

  const hooks: HalfPlaneIntersectHooks = {
    onSort: () => {
      rec.begin({ zh: `按方向角排序`, en: `Sort by angle` }).commit();
    },
    onIntersect: (_p) => {},
  };
  const { polygon } = halfPlaneIntersect(hps, hooks);

  rec
    .begin({
      zh: `完成：交区域 ${polygon.length} 个顶点`,
      en: `Done: region has ${polygon.length} vertices`,
    })
    .setGraph(
      polygon.map((p, i) => ({
        id: `v${i}`,
        label: `v${i}`,
        x: px(p.x),
        y: py(p.y),
        role: 'final' as BarRole,
      })),
      polygon.map((_, i) => ({ from: `v${i}`, to: `v${(i + 1) % polygon.length}` })),
    )
    .setMap([{ key: '顶点数', value: String(polygon.length), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
