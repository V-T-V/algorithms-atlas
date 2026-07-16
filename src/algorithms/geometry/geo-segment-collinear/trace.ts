// =============================================================================
// 线段共线判定 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { segmentCollinear, type Point } from './impl.ts';

export const DEFAULT_INPUT = {
  a: { x: 0, y: 0 },
  b: { x: 6, y: 0 },
  c: { x: 4, y: 0 },
  d: { x: 9, y: 0 },
};

function makeNodes(a: Point, b: Point, c: Point, d: Point): GraphNode[] {
  return [
    { id: 'a', label: 'A', x: a.x / 10, y: 0.7, role: 'pivot' },
    { id: 'b', label: 'B', x: b.x / 10, y: 0.7, role: 'pivot' },
    { id: 'c', label: 'C', x: c.x / 10, y: 0.4, role: 'frontier' },
    { id: 'd', label: 'D', x: d.x / 10, y: 0.4, role: 'frontier' },
  ];
}

export function buildTrace(
  input: { a: Point; b: Point; c: Point; d: Point } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { a, b, c, d } = input;
  const nodes = makeNodes(a, b, c, d);
  const edges: GraphEdge[] = [
    { from: 'a', to: 'b', role: 'compare' },
    { from: 'c', to: 'd', role: 'compare' },
  ];

  rec
    .begin({
      zh: `判定线段 AB 与 CD 是否共线、是否重叠`,
      en: `Test collinearity and overlap of segments AB and CD`,
    })
    .setGraph(nodes, edges)
    .setAux([
      { label: 'AB', value: `(${a.x},${a.y})-(${b.x},${b.y})`, role: 'pivot' },
      { label: 'CD', value: `(${c.x},${c.y})-(${d.x},${d.y})`, role: 'frontier' },
    ])
    .commit();

  const result = segmentCollinear(a, b, c, d, {
    onCross: (cAC, cAD) => {
      rec
        .begin({
          zh: `叉积 cross(A,B,C)=${cAC.toFixed(3)}，cross(A,B,D)=${cAD.toFixed(3)}`,
          en: `cross(A,B,C)=${cAC.toFixed(3)}, cross(A,B,D)=${cAD.toFixed(3)}`,
        })
        .setGraph(nodes, edges)
        .setAux([
          { label: 'cross(A,B,C)', value: cAC.toFixed(3), role: 'compare' },
          { label: 'cross(A,B,D)', value: cAD.toFixed(3), role: 'compare' },
        ])
        .commit();
    },
  });

  rec
    .begin({
      zh: `结果：共线=${result.collinear}，重叠=${result.overlap}`,
      en: `Result: collinear=${result.collinear}, overlap=${result.overlap}`,
    })
    .setGraph(nodes, edges)
    .setAux([
      { label: '共线', value: String(result.collinear), role: 'final' },
      { label: '重叠', value: String(result.overlap), role: 'final' },
    ])
    .commit();

  return rec.build();
}
