// =============================================================================
// Delaunay 翻转 · 录制帧序列
// =============================================================================

import type { Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { delaunayFlip, type Point, type Quad } from './impl.ts';

export const DEFAULT_INPUT: Quad = {
  a: { x: 0, y: 0 },
  b: { x: 2, y: 3 },
  c: { x: 4, y: 0 },
  d: { x: 2, y: 1 },
};

function norm(p: Point): { x: number; y: number } {
  return { x: 0.5 + p.x * 0.08, y: 0.7 - p.y * 0.08 };
}

export function buildTrace(quad: Quad = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b, c, d } = quad;

  const nodes: GraphNode[] = [
    { id: 'a', label: 'A', x: norm(a).x, y: norm(a).y, role: 'pivot' },
    { id: 'b', label: 'B', x: norm(b).x, y: norm(b).y, role: 'pivot' },
    { id: 'c', label: 'C', x: norm(c).x, y: norm(c).y, role: 'pivot' },
    { id: 'd', label: 'D', x: norm(d).x, y: norm(d).y, role: 'frontier' },
  ];
  const diagEdges: GraphEdge[] = [
    { from: 'a', to: 'c', role: 'compare' },
    { from: 'a', to: 'b', role: 'default' },
    { from: 'b', to: 'c', role: 'default' },
    { from: 'a', to: 'd', role: 'default' },
    { from: 'c', to: 'd', role: 'default' },
  ];

  rec
    .begin({
      zh: `四边形 ABCD，当前对角线 AC；检测是否需翻转为 BD`,
      en: `Quad ABCD, diagonal AC; test whether to flip to BD`,
    })
    .setGraph(nodes, diagEdges)
    .setAux([{ label: '当前对角', value: 'AC', role: 'pivot' }])
    .commit();

  const flipped = delaunayFlip(quad, {
    onIncircle: (pa, pb, pc, pd, v) => {
      rec
        .begin({
          zh: `incircle(${pd.x},${pd.y}) = ${v.toFixed(3)}（>0 表示 D 在 △ABC 外接圆内）`,
          en: `incircle(${pd.x},${pd.y}) = ${v.toFixed(3)} (>0 means D inside circumcircle of △ABC)`,
        })
        .setGraph(nodes, diagEdges)
        .setAux([
          { label: 'incircle 值', value: v.toFixed(3), role: 'compare' },
          { label: '是否非法', value: String(v > 0), role: 'frontier' },
        ])
        .commit();
      void pa;
      void pb;
      void pc;
    },
  });

  if (flipped) {
    const newEdges: GraphEdge[] = [
      { from: 'b', to: 'd', role: 'final' },
      { from: 'a', to: 'b', role: 'default' },
      { from: 'b', to: 'c', role: 'default' },
      { from: 'a', to: 'd', role: 'default' },
      { from: 'c', to: 'd', role: 'default' },
    ];
    rec
      .begin({
        zh: `翻转：对角线 AC → BD（满足 Delaunay）`,
        en: `Flip: diagonal AC → BD (now Delaunay-legal)`,
      })
      .setGraph(nodes, newEdges)
      .setAux([
        { label: '新对角', value: 'BD', role: 'final' },
        { label: '已翻转', value: '是', role: 'final' },
      ])
      .commit();
  } else {
    rec
      .begin({
        zh: `对角线 AC 已是 Delaunay 合法，无需翻转`,
        en: `Diagonal AC is already Delaunay-legal; no flip`,
      })
      .setGraph(nodes, diagEdges)
      .setAux([
        { label: '对角', value: 'AC', role: 'final' },
        { label: '已翻转', value: '否', role: 'final' },
      ])
      .commit();
  }

  return rec.build();
}
