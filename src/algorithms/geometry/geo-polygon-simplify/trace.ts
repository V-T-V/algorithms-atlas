// =============================================================================
// 多边形简化（Douglas-Peucker）· 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simplify, type Point } from './impl.ts';

export const DEFAULT_INPUT: Point[] = [
  { x: 0, y: 0 },
  { x: 2, y: 0.1 },
  { x: 4, y: -0.1 },
  { x: 6, y: 5 },
  { x: 8, y: 2 },
  { x: 10, y: 0 },
];
export const DEFAULT_EPSILON = 0.5;

function normalize(pts: readonly Point[]): (p: Point) => { x: number; y: number } {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const pad = 0.12;
  return (p) => ({
    x: pad + (0.5 - pad) * 2 * ((p.x - minX) / spanX),
    y: pad + (0.5 - pad) * 2 * (1 - (p.y - minY) / spanY),
  });
}

export function buildTrace(
  input: { points: Point[]; epsilon: number } = { points: DEFAULT_INPUT, epsilon: DEFAULT_EPSILON },
): Frame[] {
  const rec = new TraceRecorder();
  const { points, epsilon } = input;
  const norm = normalize(points);
  const kept = new Set<number>([0, points.length - 1]);

  const render = (note: { zh: string; en: string }, keep: Set<number>): void => {
    const nodes: GraphNode[] = points.map((p, i) => ({
      id: 'p' + i,
      label: String(i),
      x: norm(p).x,
      y: norm(p).y,
      role: keep.has(i) ? 'final' : 'default',
    }));
    const edges: GraphEdge[] = [];
    const karr = [...keep].sort((a, b) => a - b);
    for (let i = 0; i < karr.length - 1; i++) {
      edges.push({ from: 'p' + karr[i]!, to: 'p' + karr[i + 1]!, role: 'compare' });
    }
    rec
      .begin(note)
      .setGraph(nodes, edges)
      .setAux([
        { label: '保留点数', value: String(keep.size), role: 'final' },
        { label: '总点数', value: String(points.length), role: 'frontier' },
        { label: 'ε 阈值', value: String(epsilon), role: 'pivot' },
      ])
      .commit();
  };

  render(
    {
      zh: `原折线 ${points.length} 点，阈值 ε = ${epsilon}`,
      en: `Original ${points.length}-point polyline, ε = ${epsilon}`,
    },
    new Set(points.map((_, i) => i)),
  );

  const result = simplify(points, epsilon, {
    onKeep: (idx) => {
      kept.add(idx);
      render(
        { zh: `保留点 ${idx}（距基线最远 > ε）`, en: `Keep point ${idx} (farthest > ε)` },
        new Set(kept),
      );
    },
  });

  const finalKeep = new Set<number>();
  for (let i = 0; i < points.length; i++) {
    if (result.includes(points[i]!)) finalKeep.add(i);
  }
  render(
    {
      zh: `简化完成：${points.length} → ${result.length} 点`,
      en: `Done: ${points.length} → ${result.length} points`,
    },
    finalKeep,
  );

  return rec.build();
}
