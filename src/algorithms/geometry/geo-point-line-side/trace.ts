// =============================================================================
// 点在直线哪侧 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pointLineSide, type Point } from './impl.ts';

export const DEFAULT_INPUT = {
  a: { x: 1, y: 1 },
  b: { x: 7, y: 2 },
  p: { x: 3, y: 5 },
};

function norm(v: number, span: number, pad: number): number {
  return pad + ((0.5 - pad) * 2 * v) / span;
}

export function buildTrace(input: { a: Point; b: Point; p: Point } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b, p } = input;
  const pts = [a, b, p];
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const q of pts) {
    if (q.x < minX) minX = q.x;
    if (q.x > maxX) maxX = q.x;
    if (q.y < minY) minY = q.y;
    if (q.y > maxY) maxY = q.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const pad = 0.15;
  const nx = (q: Point) => norm(q.x - minX, spanX, pad);
  const ny = (q: Point) => pad + (0.5 - pad) * 2 * (1 - (q.y - minY) / spanY);

  const nodes: GraphNode[] = [
    { id: 'a', label: 'A', x: nx(a), y: ny(a), role: 'pivot' },
    { id: 'b', label: 'B', x: nx(b), y: ny(b), role: 'pivot' },
    { id: 'p', label: 'P', x: nx(p), y: ny(p), role: 'frontier' },
  ];
  const edge: GraphEdge = { from: 'a', to: 'b', role: 'compare' };

  rec
    .begin({
      zh: `判断点 P(${p.x},${p.y}) 在有向直线 A(${a.x},${a.y})→B(${b.x},${b.y}) 的哪侧`,
      en: `Test side of P(${p.x},${p.y}) w.r.t. directed line A(${a.x},${a.y})→B(${b.x},${b.y})`,
    })
    .setGraph(nodes, [edge])
    .setAux([
      { label: 'A', value: `(${a.x},${a.y})`, role: 'pivot' },
      { label: 'B', value: `(${b.x},${b.y})`, role: 'pivot' },
      { label: 'P', value: `(${p.x},${p.y})`, role: 'frontier' },
    ])
    .commit();

  const side = pointLineSide(a, b, p, {
    onCross: (crossValue, s) => {
      rec
        .begin({
          zh: `叉积 = ${crossValue.toFixed(3)} → 符号 = ${s}`,
          en: `cross = ${crossValue.toFixed(3)} → sign = ${s}`,
        })
        .setGraph(nodes, [edge])
        .setAux([
          { label: '叉积值', value: crossValue.toFixed(3), role: 'compare' },
          { label: '符号', value: String(s), role: 'frontier' },
        ])
        .commit();
    },
  });
  const sideText = side > 0 ? '左侧' : side < 0 ? '右侧' : '共线（线上）';
  const sideTextEn = side > 0 ? 'LEFT (CCW)' : side < 0 ? 'RIGHT' : 'COLLINEAR (on line)';

  rec
    .begin({
      zh: `最终判定：P 在直线的 ${sideText}`,
      en: `Result: P is on the ${sideTextEn}`,
    })
    .setGraph(nodes, [edge])
    .setAux([
      { label: '判定', value: sideText, role: 'final' },
      { label: 'cross sign', value: String(side), role: 'final' },
    ])
    .commit();

  return rec.build();
}
