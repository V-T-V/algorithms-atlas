// 凸多边形判定 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { convexPolygon, type Point, type ConvexPolygonHooks } from './impl.ts';

export interface CpInput {
  poly: Point[];
}

export const DEFAULT_INPUT: CpInput = {
  poly: [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 6, y: 6 },
    { x: 0, y: 6 },
  ],
};

const graphFrom = (poly: Point[], signs: number[]) => ({
  nodes: poly.map((p, i) => ({
    id: String(i),
    label: `s=${signs[i] ?? '?'}`,
    x: (p.x % 10) / 10,
    y: 1 - (p.y % 10) / 10,
    role: 'default' as BarRole,
  })),
  edges: poly.map((_, i) => ({ from: String(i), to: String((i + 1) % poly.length) })),
});

/** 录制演示帧序列。 */
export function buildTrace(input: CpInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { poly } = input;

  rec
    .begin({ zh: `多边形（${poly.length} 顶点）`, en: `Polygon (${poly.length} vertices)` })
    .setGraph(graphFrom(poly, []).nodes, graphFrom(poly, []).edges)
    .commit();

  const hooks: ConvexPolygonHooks = {
    onEdge: (_i, _cr) => {},
  };
  const { convex, signs } = convexPolygon(poly, hooks);

  rec
    .begin({
      zh: `逐边叉积符号：[${signs.join(', ')}]`,
      en: `Cross signs per edge: [${signs.join(', ')}]`,
    })
    .setGraph(graphFrom(poly, signs).nodes, graphFrom(poly, signs).edges)
    .commit();

  rec
    .begin({
      zh: `完成：${convex ? '凸' : '非凸'}多边形`,
      en: `Done: ${convex ? 'convex' : 'not convex'}`,
    })
    .setMap([
      {
        key: '结果',
        value: convex ? '凸 / convex' : '非凸 / not convex',
        role: convex ? ('final' as BarRole) : ('warn' as BarRole),
      },
    ])
    .commit();

  return rec.build();
}
