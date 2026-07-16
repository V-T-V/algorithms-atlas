// =============================================================================
// 圆与三角形关系 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { circleTriangle, type Point } from './impl.ts';

export const DEFAULT_INPUT = {
  center: { x: 5, y: 1 },
  r: 1.5,
  a: { x: 0, y: 0 },
  b: { x: 4, y: 0 },
  c: { x: 2, y: 4 },
};

export function buildTrace(
  input: { center: Point; r: number; a: Point; b: Point; c: Point } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { center, r, a, b, c } = input;
  const allPts = [center, a, b, c];
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of allPts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const span = Math.max(maxX - minX, maxY - minY, r * 2) || 1;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const nx = (p: Point) => 0.5 + 0.45 * ((p.x - cx) / span) * 2;
  const ny = (p: Point) => 0.5 + 0.45 * ((cy - p.y) / span) * 2;

  const nodes: GraphNode[] = [
    { id: 'ctr', label: 'C', x: nx(center), y: ny(center), role: 'pivot' },
    { id: 'a', label: 'A', x: nx(a), y: ny(a), role: 'frontier' },
    { id: 'b', label: 'B', x: nx(b), y: ny(b), role: 'frontier' },
    { id: 'c', label: 'C2', x: nx(c), y: ny(c), role: 'frontier' },
  ];
  const edges: GraphEdge[] = [
    { from: 'a', to: 'b', role: 'compare' },
    { from: 'b', to: 'c', role: 'compare' },
    { from: 'c', to: 'a', role: 'compare' },
  ];

  rec
    .begin({
      zh: `圆 (C=${center.x},${center.y}, r=${r}) 与三角形 ABC`,
      en: `Circle (C=${center.x},${center.y}, r=${r}) vs triangle ABC`,
    })
    .setGraph(nodes, edges)
    .setAux([
      { label: '圆心', value: `(${center.x},${center.y})`, role: 'pivot' },
      { label: '半径', value: String(r), role: 'pivot' },
    ])
    .commit();

  const result = circleTriangle(center, r, a, b, c, {
    onCenterInTri: (inside) => {
      rec
        .begin({
          zh: `圆心是否在三角形内：${inside}`,
          en: `center inside triangle: ${inside}`,
        })
        .setGraph(nodes, edges)
        .setAux([{ label: '圆心在三角形内', value: String(inside), role: 'frontier' }])
        .commit();
    },
    onMinDist: (md) => {
      rec
        .begin({
          zh: `圆心到三角形最短距离 = ${md.toFixed(3)}`,
          en: `min distance center→triangle = ${md.toFixed(3)}`,
        })
        .setGraph(nodes, edges)
        .setAux([
          { label: '最短距离', value: md.toFixed(3), role: 'compare' },
          { label: '半径', value: String(r), role: 'pivot' },
        ])
        .commit();
    },
  });

  const textMap: Record<string, { zh: string; en: string }> = {
    disjoint: { zh: '相离', en: 'disjoint' },
    intersect: { zh: '相交', en: 'intersect' },
    'circle-contains-triangle': { zh: '圆包含三角形', en: 'circle contains triangle' },
  };
  rec
    .begin({
      zh: `结果：${textMap[result]!.zh}`,
      en: `Result: ${textMap[result]!.en}`,
    })
    .setGraph(nodes, edges)
    .setAux([{ label: '关系', value: textMap[result]!.zh, role: 'final' }])
    .commit();

  return rec.build();
}
