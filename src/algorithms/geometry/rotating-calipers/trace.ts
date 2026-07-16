// 旋转卡壳 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotatingCalipers, type Point, type RotatingCalipersHooks } from './impl.ts';

export interface RcInput {
  hull: Point[];
}

export const DEFAULT_INPUT: RcInput = {
  hull: [
    { x: 0, y: 0 },
    { x: 4, y: -1 },
    { x: 8, y: 0 },
    { x: 6, y: 4 },
    { x: 2, y: 5 },
  ],
};

const px = (v: number): number => (v % 10) / 10;
const py = (v: number): number => 1 - ((v + 4) % 10) / 10;

/** 录制演示帧序列。 */
export function buildTrace(input: RcInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { hull } = input;

  rec
    .begin({
      zh: `凸多边形（${hull.length} 顶点）`,
      en: `Convex polygon (${hull.length} vertices)`,
    })
    .setGraph(
      hull.map((p, i) => ({
        id: `h${i}`,
        label: String(i),
        x: px(p.x),
        y: py(p.y),
        role: 'default' as BarRole,
      })),
      hull.map((_, i) => ({ from: `h${i}`, to: `h${(i + 1) % hull.length}` })),
    )
    .commit();

  const hooks: RotatingCalipersHooks = {
    onAntipodal: (i, j, dist) => {
      rec
        .begin({
          zh: `对踵点 ${i}-${j}，距离 ${dist.toFixed(2)}`,
          en: `Antipodal ${i}-${j}, dist ${dist.toFixed(2)}`,
        })
        .setGraph(
          hull.map((p, k) => ({
            id: `h${k}`,
            label: String(k),
            x: px(p.x),
            y: py(p.y),
            role: (k === i || k === j ? 'compare' : 'default') as BarRole,
          })),
          [
            ...hull.map((_, k) => ({ from: `h${k}`, to: `h${(k + 1) % hull.length}` })),
            { from: `h${i}`, to: `h${j}` },
          ],
        )
        .commit();
    },
  };
  const { diameter, pair } = rotatingCalipers(hull, hooks);

  const pi = hull.findIndex((p) => p.x === pair[0]!.x && p.y === pair[0]!.y);
  const pj = hull.findIndex((p) => p.x === pair[1]!.x && p.y === pair[1]!.y);

  rec
    .begin({
      zh: `完成：直径 = ${diameter.toFixed(3)}`,
      en: `Done: diameter = ${diameter.toFixed(3)}`,
    })
    .setGraph(
      hull.map((p, k) => ({
        id: `h${k}`,
        label: String(k),
        x: px(p.x),
        y: py(p.y),
        role: (k === pi || k === pj ? 'swap' : 'default') as BarRole,
      })),
      [
        ...hull.map((_, k) => ({ from: `h${k}`, to: `h${(k + 1) % hull.length}` })),
        { from: `h${pi}`, to: `h${pj}` },
      ],
    )
    .setMap([{ key: '直径', value: diameter.toFixed(3), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
