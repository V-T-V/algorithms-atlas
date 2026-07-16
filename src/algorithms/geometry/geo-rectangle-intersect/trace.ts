// =============================================================================
// 矩形相交面积 · 录制帧序列
// =============================================================================

import type { Frame, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rectIntersect, type Rect } from './impl.ts';

export const DEFAULT_INPUT = {
  a: { x: 0, y: 0, w: 4, h: 4 },
  b: { x: 2, y: 2, w: 4, h: 4 },
};

function rectNodes(a: Rect, b: Rect): GraphNode[] {
  const maxX = Math.max(a.x + a.w, b.x + b.w);
  const maxY = Math.max(a.y + a.h, b.y + b.h);
  const span = Math.max(maxX, maxY) || 1;
  const ny = (v: number) => 0.9 - (v / span) * 0.8;
  const nx = (v: number) => 0.1 + (v / span) * 0.8;
  return [
    { id: 'a-tl', x: nx(a.x), y: ny(a.y), role: 'pivot' },
    { id: 'a-br', x: nx(a.x + a.w), y: ny(a.y + a.h), role: 'pivot' },
    { id: 'b-tl', x: nx(b.x), y: ny(b.y), role: 'frontier' },
    { id: 'b-br', x: nx(b.x + b.w), y: ny(b.y + b.h), role: 'frontier' },
  ];
}

export function buildTrace(input: { a: Rect; b: Rect } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const nodes = rectNodes(a, b);

  rec
    .begin({
      zh: `矩形 A(${a.x},${a.y},${a.w}×${a.h}) 与 B(${b.x},${b.y},${b.w}×${b.h})`,
      en: `Rect A(${a.x},${a.y},${a.w}×${a.h}) vs B(${b.x},${b.y},${b.w}×${b.h})`,
    })
    .setGraph(nodes, [])
    .setAux([
      { label: 'A', value: `(${a.x},${a.y}) ${a.w}×${a.h}`, role: 'pivot' },
      { label: 'B', value: `(${b.x},${b.y}) ${b.w}×${b.h}`, role: 'frontier' },
    ])
    .commit();

  const result = rectIntersect(a, b, {
    onOverlap: (w, h, area) => {
      rec
        .begin({
          zh: `相交矩形 ${w.toFixed(2)}×${h.toFixed(2)}，面积 = ${area.toFixed(2)}`,
          en: `Overlap ${w.toFixed(2)}×${h.toFixed(2)}, area = ${area.toFixed(2)}`,
        })
        .setGraph(nodes, [])
        .setAux([
          { label: '相交宽', value: w.toFixed(2), role: 'compare' },
          { label: '相交高', value: h.toFixed(2), role: 'compare' },
          { label: '面积', value: area.toFixed(2), role: 'final' },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: `完成：相交面积 = ${result.area}`,
      en: `Done: intersection area = ${result.area}`,
    })
    .setAux([
      { label: '相交面积', value: String(result.area), role: 'final' },
      { label: '是否相交', value: String(result.rect !== null), role: 'final' },
    ])
    .commit();

  return rec.build();
}
